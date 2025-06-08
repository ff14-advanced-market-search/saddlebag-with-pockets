# syntax=docker/dockerfile:1
# Multistage build
# Stage 0: Build
FROM --platform=linux/amd64 node:20-alpine

ENV APP_HOME=/app
WORKDIR ${APP_HOME}

COPY package.json .

RUN set -eux \
    && yarn install

COPY . .

CMD ["yarn", "run", "dev"]
