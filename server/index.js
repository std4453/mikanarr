require('./rss');
require('./proxy');
require('./sonarr');
require('./api');

const server = require('./server');
const port = parseInt(process.env.PORT || "12306");
server.listen(port, () => {
  console.log(`App started on port ${port}`);
});
