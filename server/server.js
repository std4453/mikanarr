const jsonServer = require("json-server");
const server = jsonServer.create();
const middlewares = jsonServer.defaults({
  static: "./build",
});
server.use(middlewares);

module.exports = server;
