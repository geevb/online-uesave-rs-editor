use axum::{
    Router,
    response::IntoResponse, 
    routing::{get, put}, 
    extract::{Json, Multipart},
    http::{Method, HeaderMap},
    http::header::{CONTENT_DISPOSITION, CONTENT_TYPE}
};
use std::fs::File;
use tower_http::cors::{Any, CorsLayer};
use std::io::{Cursor, BufReader};
use serde_json::{json, Value};
use uesave::Save;

async fn healthz() -> &'static str {
    "OK!"
}

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
    let mut headers = HeaderMap::new();
    headers.insert(CONTENT_TYPE, "application/octet-stream".parse().unwrap());
    headers.insert(CONTENT_DISPOSITION, "attachment; filename=\"Player_76561197994149843.sav\"".parse().unwrap());

    let s1: Save = Save::read(
        &mut Box::new(
            BufReader::new(
                File::open(&"saves/Player_76561197994149843.sav").unwrap()
            )
        )
    ).unwrap();

    // let json2 = serde_json::to_value(s1).unwrap();

    // let j1: Value = serde_json::from_reader(Box::new(BufReader::new(File::open(&"tmp.json").unwrap()))).unwrap();

    // let j2: Save = serde_json::from_reader(Box::new(BufReader::new(File::open(&"tmp.json").unwrap()))).unwrap();

    // let s2: Save = serde_json::from_value(json2.clone()).unwrap();

    // let s3: Save = serde_json::from_value(input.clone()).unwrap();

    let mut buffer: Vec<u8> = vec![];
    s1.write(&mut buffer).unwrap();

    (headers, buffer)
}

#[shuttle_runtime::main]
async fn main()-> shuttle_axum::ShuttleAxum {
    let cors = CorsLayer::new()
        .allow_methods([Method::OPTIONS, Method::GET, Method::PUT])
        .allow_headers([axum::http::header::CONTENT_TYPE])
        .allow_origin(Any);

    let router = Router::new()
        .route("/", get(healthz))
        .route("/to_json", put(to_json))
        .route("/from_json", put(from_json))
        .layer(cors);

    Ok(router.into())
}