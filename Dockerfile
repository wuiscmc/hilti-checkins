FROM node:14.15.3-alpine3.10 as backend
COPY be/*.js be/*.json ./
RUN npm install --production
ENV PORT=80 
CMD npm run prod

#FROM base as frontend
#ENV PORT=80 
#COPY fe/dist ./
#RUN npm install --production
#CMD npm run prod
FROM nginx:1.19-alpine as frontend
COPY fe/dist /usr/share/nginx/html
