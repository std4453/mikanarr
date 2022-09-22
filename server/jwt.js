if (process.env.DISABLE_AUTH === 'true') {
  module.exports = [];
  return;
}

const server = require('./server');

const fs = require('fs');
const pubKey = fs.readFileSync('data/jwt.key.pub');
const privKey = fs.readFileSync('data/jwt.key');

const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken');

server.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({
      username,
    }, privKey, {
      algorithm: 'RS512',
    });
    res.json({
      token
    });
  } else {
    res.status('401');
    res.send('Username or password incorrect');
  }
});

const middlewares = [
  expressJWT({
    secret: pubKey,
    algorithms: ['RS512'],
  }),
  function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send('Invalid token');
    }
  },
];

module.exports = middlewares;
