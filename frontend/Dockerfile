# build stage
FROM node:latest as build-stage

WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm install -g @angular/cli && npm install
COPY ./ .
RUN npm run build shared
RUN npm run build --project orgRegistration

# run stage
FROM registry.redhat.io/rhscl/nginx-120-rhel7:latest
COPY --from=build-stage /usr/src/app/dist/org-registration /usr/share/nginx/html
