import { setReqPath } from "../lib/utils";
import cache from "../lib/cache";
import logger from "../lib/logger";
const fs = require("fs");
const join = require("path").join;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const appConfig = require("../config");
const models = join(__dirname, "models");
const { wrap: async } = require("co");

// Bootstrap models
fs.readdirSync(models)
  .filter(file => {
    return ~file.search(/^[^\.].*\.js$/);
  })
  .forEach(file => require(join(models, file)));

const app = require("./proxy").default;
const simulatePipeline = require("./pipeline/simulatePipeline").default;

// Bootstrap routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/projects", require("./routes/projects").default);
app.use("/apis", require("./routes/apis").default);

//走模拟接口路由
app.use((req, res, next) => {
  res.locals.supervisorStatus = parseInt(req.param("supervisorStatus", 0));
  setReqPath(req.originalUrl.split("?")[0], req);
  async(simulatePipeline.execute)
    .apply(simulatePipeline, [req, res])
    .catch(err => {
      console.error(err);
      logger.error(err);
      res.status(500).send("Sorry,server something broke!");
    });
});

app.use((err, req, res, next) => {
  console.error(err);
  logger.error(err);
  res.status(500).send("Sorry,server something broke!");
});

/**
 * 初始化缓存
 */
function initCache() {
  require("./store/project")
    .default.getList()
    .then(projects => {
      cache.dispatch({ type: "init", payload: projects });
      cache.subscribe(state => {
        console.log(state);
      });
    });
}

/**
 * 启动服务器监听
 */
function listen() {
  app.listen(appConfig.port, () => {
    console.log(`Api Supervisor Server running on port ${appConfig.port}`);
  });
}

function afterConnected() {
  initCache();
  listen();
}

//mongodb connect
function connect() {
  mongoose.connect(appConfig.db);
  const db = mongoose.connection;
  db.on("error", console.log);
  db.once("open", afterConnected);
}
connect();
