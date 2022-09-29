FROM node:16 AS builder
WORKDIR /

COPY package.json ./
COPY yarn.lock ./
COPY public ./public
COPY server ./server
COPY src ./src
RUN yarn --frozen-lockfile
RUN yarn build
RUN chmod 755 ./index-*

FROM alpine:latest 
RUN apk --no-cache add ca-certificates
WORKDIR /usr/src/app
COPY --from=builder /build ./build
COPY --from=builder /index-alpine ./mikanarr
EXPOSE 12306
VOLUME /usr/src/app/data
CMD ["./mikanarr"]
