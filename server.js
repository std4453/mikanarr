const config = {
  port: 12306,
  host: "127.0.0.1",
};

const xml2js = require("xml2js");
const parser = new xml2js.Parser();
const builder = new xml2js.Builder();
const axios = require("axios");
const route = async (req, res) => {
  try {
    const { data: xmlStr } = await axios.get(`https://mikanani.me/RSS/Classic`);
    const result = await parser.parseStringPromise(xmlStr);

    // pre-compile
    const { data: database } = await axios.get(
      `http://${config.host}:${config.port}/patterns`
    );
    const rules = database.map(({ pattern, ...rest }) => ({
      pattern: new RegExp(pattern, "g"),
      ...rest,
    }));

    const items = [];
    for (const item of result.rss.channel[0].item) {
      const {
        title: [title],
        enclosure,
        link,
        torrent: [{ pubDate }],
      } = item;
      for (const { pattern, series, season } of rules) {
        const match = pattern.exec(title);
        if (!match) continue;
        const { episode } = match.groups;
        const normalized = `${series} - S${season}E${episode}`;
        items.push({
          title: [normalized],
          pubDate,
          enclosure,
          link,
        });
        break;
      }
    }
    result.rss.channel[0].item = items;
    res.set("Content-Type", "text/xml");
    res.send(builder.buildObject(result));
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
};

const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("data/database.json");
const middlewares = jsonServer.defaults({
  static: "./build",
});

server.use(middlewares);
server.get("/rss", route);
server.use("/api", router);
server.listen(config.port, () => {
  console.log(`App started on port ${config.port}`);
});
