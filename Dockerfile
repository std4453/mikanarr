FROM node:14
WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
RUN yarn install --production=true
COPY build ./build
COPY server ./server
EXPOSE 12306
VOLUME /usr/src/app/data
CMD ["yarn", "start"]
