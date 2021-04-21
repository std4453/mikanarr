const config = {
  port: 12306,
  host: "127.0.0.1",
};

const xml2js = require("xml2js");
const parser = new xml2js.Parser();
const builder = new xml2js.Builder();
const axios = require("axios");
const qs = require("qs");
const route = async (req, res) => {
  try {
    const { data: xmlStr } = await axios.get(
      `https://mikanani.me${req.path}?${qs.stringify(req.query)}`
    );
    const result = await parser.parseStringPromise(xmlStr);

    // pre-compile
    const { data: database } = await axios.get(
      `http://${config.host}:${config.port}/api/patterns`
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
      for (const { pattern, series, season, language, quality } of rules) {
        const match = pattern.exec(title);
        if (!match) continue;
        const { episode } = match.groups;
        const normalized = `${series} - S${season}E${episode} - ${language} - ${quality}`;
        items.push({
          title: [normalized],
          pubDate,
          enclosure,
          link,
          guid: [
            {
              $: { isPermaLink: true },
              _: link[0],
            },
          ],
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

const proxy = async (req, res) => {
  // proxy only requests to mikan anime to prevent attacks
  if (!req?.query?.url?.startsWith("https://mikanani.me")) {
    res.status(403).send("Forbidden");
    return;
  }
  try {
    const { data: xmlStr } = await axios.get(req.query.url);
    const result = await parser.parseStringPromise(xmlStr);
    const titles = result.rss.channel[0].item.map(
      ({ title: [title] }) => title
    );
    res.send(titles);
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
server.get("/RSS/*", route);
server.get("/proxy", proxy);
server.use("/api", router);
server.listen(config.port, () => {
  console.log(`App started on port ${config.port}`);
});
