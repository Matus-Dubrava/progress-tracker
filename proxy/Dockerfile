FROM nginx:alpine

RUN mkdir /etc/nginx/certs
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY ./certs/https* /etc/nginx/certs/