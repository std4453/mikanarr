const db = require('./db');
const jsonServer = require("json-server");
const router = jsonServer.router(db);
const server = require('./server');
server.use("/api", router);
