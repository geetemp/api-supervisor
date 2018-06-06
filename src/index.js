import app from "./proxy";
import apiRouter from "./routes/api";
import projectRouter from "./routes/project";
import statusRouter from "./routes/status";
import stackRouter from "./routes/stack";

app.use("/project", projectRouter);

app.listen(appConfig.port, () => {
  console.log(`Api Supervisor Server running on port ${appConfig.port}`);
});
