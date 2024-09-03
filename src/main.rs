use axum::{extract::Multipart, routing::get, routing::put, http::Method, Router};
use tower_http::cors::{Any, CorsLayer};
use std::io::{Read, Cursor, BufReader};
use uesave::{Save};
use serde_json::json;

async fn healthz() -> &'static str {
    "OK!"
}

async fn upload(mut multipart: Multipart)-> String {
    if let Some(field) = multipart.next_field().await.unwrap() {
        let data = field.bytes().await.unwrap();
        let cursor = Cursor::new(data);
        let save = Save::read(&mut BufReader::new(cursor)).unwrap();
        return json!(save).to_string();
    }
    json!({}).to_string()
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
