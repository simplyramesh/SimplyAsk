FROM node:20.13.1-alpine3.20 AS builder

WORKDIR /opt/web
COPY package.json package-lock.json ./
COPY deploy/.env ./
RUN npm install

ENV PATH="./node_modules/.bin:$PATH"

COPY . ./
RUN npm run build

FROM nginx:stable-alpine3.19
ARG  UPSTREAM_NAME=empty
RUN  touch /var/run/nginx.pid && chown -R nginx:nginx /var/run/nginx.pid
RUN  mkdir /etc/nginx/includes && chown -R nginx:nginx /etc/nginx/includes
RUN  chown -R nginx:nginx /var/cache/nginx /var/log/nginx
USER nginx
COPY --chown=nginx:nginx ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx ./nginx/upstream-${UPSTREAM_NAME}.conf /etc/nginx/includes/upstream.conf
COPY --from=builder --chown=nginx:nginx /opt/web/build /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
