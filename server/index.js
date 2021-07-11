const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("data/database.json");
const db = low(adapter);
db.defaults({ patterns: [] }).write();

const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router(db);
const middlewares = jsonServer.defaults({
  static: "./build",
});
server.use(middlewares);

require('global-agent/bootstrap');
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
    const database = db.get("patterns").value();
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
server.get("/RSS/*", route);

server.get("/proxy", async (req, res) => {
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
});

const { createProxyMiddleware } = require("http-proxy-middleware");
server.use(
  "/sonarr",
  createProxyMiddleware({
    target: process.env.SONARR_HOST,
    pathRewrite(path, req) {
      const url = new URL(req.url, `http://${req.headers.host}`);
      url.searchParams.append("apikey", process.env.SONARR_API_KEY);
      url.pathname = url.pathname.replace(/^\/sonarr/, "/api");
      return `${url.pathname}${url.search}`;
    },
    changeOrigin: true,
  })
);

server.use("/api", router);

const port = parseInt(process.env.PORT || "12306");
server.listen(port, () => {
  console.log(`App started on port ${port}`);
});
