import app from "./proxy";
var bodyParser = require("body-parser");
import apisRouter from "./routes/apis";
import projectsRouter from "./routes/projects";
import simulatePipeline from "./pipeline/simulatePipeline";
const appConfig = require("../config/app.json");
import { setReqPath } from "./utils";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/projects", projectsRouter);
app.use("/apis", apisRouter);

//走模拟接口路由
app.use((req, res) => {
  res.locals.supervisorStatus = parseInt(req.param("supervisorStatus", 0));
  setReqPath(req.originalUrl.split("?")[0], req);
  simulatePipeline.execute(req, res);
});

app.listen(appConfig.port, () => {
  console.log(`Api Supervisor Server running on port ${appConfig.port}`);
});
