// import apisRouter from "./routes/apis";
// import projectsRouter from "./routes/projects";
// import simulatePipeline from "./pipeline/simulatePipeline";
import { setReqPath } from "./utils";
const fs = require("fs");
const join = require("path").join;
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const appConfig = require("../config");
const models = join(__dirname, "models");

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
app.use((req, res) => {
  res.locals.supervisorStatus = parseInt(req.param("supervisorStatus", 0));
  setReqPath(req.originalUrl.split("?")[0], req);
  simulatePipeline.execute(req, res);
});

function listen() {
  app.listen(appConfig.port, () => {
    console.log(`Api Supervisor Server running on port ${appConfig.port}`);
  });
}

//mongodb connect
function connect() {
  mongoose.connect(appConfig.db);
  const db = mongoose.connection;
  db.on("error", console.log);
  db.once("open", listen);
}
connect();
