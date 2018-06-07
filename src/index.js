import app from "./proxy";
import apisRouter from "./routes/apis";
import projectsRouter from "./routes/projects";
import statusesRouter from "./routes/statuses";
import stacksRouter from "./routes/stacks";
const appConfig = require("../config/app.json");

app.use("/projects", projectsRouter);
app.use("/apis", apisRouter);
app.use("/statuses", statusesRouter);
app.use("/stacks", stacksRouter);

app.listen(appConfig.port, () => {
  console.log(`Api Supervisor Server running on port ${appConfig.port}`);
});
