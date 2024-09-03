use axum::{
    Router,
    extract::Multipart,
    http::Method,
    routing::get,
    routing::put,
    response::Json
};
use tower_http::cors::{Any, CorsLayer};
use std::io::{Cursor, BufReader};
use serde_json::{json, Value};
use uesave::{Save};

async fn healthz() -> &'static str {
    "OK!"
}

async fn upload(mut multipart: Multipart) -> Json<Value> {
    if let Some(field) = multipart.next_field().await.unwrap() {
        let data = field.bytes().await.unwrap();
        let cursor = Cursor::new(data);
        match Save::read(&mut BufReader::new(cursor)) {
            Ok(save) => Json(json!({ "data": save })),
            Err(_) => Json(json!({ "error": "Failed to parse .sav file" })),
        }
    } else {
        Json(json!({ "error": "No file found" }))
    }
}

#[shuttle_runtime::main]
async fn main()-> shuttle_axum::ShuttleAxum {
    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::PUT])
        .allow_origin(Any);

    let router = Router::new()
        .route("/", get(healthz))
        .route("/upload", put(upload))
        .layer(cors);

    Ok(router.into())
}
