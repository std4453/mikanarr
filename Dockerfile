FROM node:14
WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY build ./build
COPY server ./server
EXPOSE 12306
CMD ["yarn", "start"]
