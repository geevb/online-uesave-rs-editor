FROM node:20.17 as build-ui

WORKDIR /app/ui
COPY ./ui /app/ui
RUN yarn install && yarn build

FROM rust:1.80.1 as build-server

WORKDIR /app/server
COPY ./server ./app/server
RUN cargo install --path .

