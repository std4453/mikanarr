FROM node:16 AS builder
WORKDIR /

COPY package.json ./
COPY yarn.lock ./
COPY public ./public
COPY server ./server
COPY src ./src
RUN yarn install
RUN yarn build
RUN chmod 755 ./index-*

FROM alpine:latest 
RUN apk --no-cache add ca-certificates
WORKDIR /
COPY --from=builder /build ./build
COPY --from=builder /index-alpine ./index
EXPOSE 12306
VOLUME /data
CMD ["./index"]
