# build stage
ARG VERSION_TAG=undefined
ARG COMMIT_HASH=undefined

FROM node:fermium as build-stage

WORKDIR /usr/src/app
COPY frontend/package*.json ./
RUN npm install -g @angular/cli && npm install
COPY frontend/ .
RUN npm run build

# production stage
FROM caddy:alpine as production-stage

ARG VERSION_TAG
ARG COMMIT_HASH

ENV VERSION_TAG=$VERSION_TAG
ENV COMMIT_HASH=$COMMIT_HASH

COPY --from=build-stage /usr/src/app/dist /srv