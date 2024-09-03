FROM rust:1.80.1

WORKDIR /usr/src/myapp
COPY . .

RUN cargo install --path .
