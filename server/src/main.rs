use axum::{
    Router,
    http::Method,
    response::{IntoResponse, Html}, 
    routing::{get, put}, 
    extract::{Json, Multipart},
};
use tower_http::{
    cors::CorsLayer, 
    services::{ServeFile, ServeDir}
};
use std::io::{Cursor, BufReader};
use serde_json::{json, Value};
use uesave::Save;

async fn to_json(mut multipart: Multipart) -> Json<Value> {
    if let Some(field) = multipart.next_field().await.unwrap() {
        let data = field.bytes().await.unwrap();
        let cursor = Cursor::new(data);
        match Save::read(&mut Box::new(BufReader::new(cursor))) {
            Ok(save) => Json(json!({ "data": save })),
            Err(_) => Json(json!({ "error": "Failed to parse .sav file" })),
        }
    } else {
        Json(json!({ "error": "No file found" }))
    }
}

async fn from_json(Json(input): Json<Value>) -> impl IntoResponse {
    let save: Save = serde_json::from_value(input.clone()).unwrap();

    let mut buffer: Vec<u8> = vec![];
    save.write(&mut buffer).unwrap();

    buffer
}

async fn index() -> Html<String> {
    Html(include_str!("../../ui/dist/index.html").to_string())
}

#[shuttle_runtime::main]
async fn main()-> shuttle_axum::ShuttleAxum {
    let cors = CorsLayer::new()
        .allow_methods([Method::OPTIONS, Method::GET, Method::PUT])
        .allow_headers([axum::http::header::CONTENT_TYPE]);

    let router = Router::new()
        .route("/", get(index))
        .nest_service("/favicon.ico", ServeFile::new("../ui/dist/favicon.ico"))
        .nest_service("/assets", ServeDir::new("../ui/dist/assets"))
        .route("/api/to_json", put(to_json))
        .route("/api/from_json", put(from_json))
        .layer(cors);

    Ok(router.into())
}