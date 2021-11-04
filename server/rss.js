require('global-agent/bootstrap');

const xml2js = require("xml2js");
const parser = new xml2js.Parser();
const builder = new xml2js.Builder();

const axios = require("axios");
const qs = require("qs");

const db = require('./db');

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
        const match = Boolean(title.match(pattern));
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

const server = require('./server');

server.get("/RSS/*", route);
