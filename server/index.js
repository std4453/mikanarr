require('dotenv').config({ path: '/data/.env' })
const server = require('./server');
const express = require('express');
server.use(express.json());

require('./rss');
require('./proxy');
require('./sonarr');
require('./jwt');
require('./api');

const port = parseInt(process.env.PORT || "12306");
server.listen(port, () => {
  console.log(`App started on port ${port}`);
});
