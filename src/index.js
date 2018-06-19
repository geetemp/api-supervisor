import app from "./proxy";
import apisRouter from "./routes/apis";
import projectsRouter from "./routes/projects";
var bodyParser = require("body-parser");
const appConfig = require("../config/app.json");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/projects", projectsRouter);
app.use("/apis", apisRouter);

app.listen(appConfig.port, () => {
  console.log(`Api Supervisor Server running on port ${appConfig.port}`);
});
