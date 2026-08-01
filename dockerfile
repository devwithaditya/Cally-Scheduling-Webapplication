FROM node:20-alpine as backend-builder

COPY ./backend /app

WORKDIR /app

RUN npm install

CMD ["node","server.js"] 