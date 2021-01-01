ARG NODE_VERSION=14.15
ARG NGINX_VERSION=1.19
ARG NODE_IMAGE_TAG=alpine3.12

FROM node:${NODE_VERSION}-${NODE_IMAGE_TAG} as backend
RUN mkdir -p /app
WORKDIR /app
COPY be/*.js be/*.json ./
RUN npm install --production
CMD npm run prod

FROM node:${NODE_VERSION}-${NODE_IMAGE_TAG} as frontend-dev
RUN mkdir -p /app
WORKDIR /app
COPY fe/*.json fe/*.js ./
COPY fe/dist dist
COPY fe/src src
RUN npm install 
ENV PORT=80
CMD npm run dev 

FROM nginx:${NGINX_VERSION}-alpine as frontend
COPY fe/dist /usr/share/nginx/html
