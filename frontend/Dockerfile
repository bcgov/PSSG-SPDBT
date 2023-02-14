# build stage
FROM node:latest as build-stage

WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm install -g @angular/cli && npm install
COPY ./ .
RUN npm run build

# run stage
FROM caddy:alpine
COPY ./Caddyfile /etc/caddy
COPY --from=build-stage /usr/src/app/dist /usr/share/caddy
