import express from "express";
import proxy from "http-proxy-middleware";
import projectStore from "./store/project";

const app = express();
const appConfig = require("../config/app.json");

const projects = projectStore.getList();

/**
 * 路由重写
 * @param {*} projects
 */
function createPathRewrite(projects) {
  projects = projects || [];
  let pathRewrite = {};
  for (let pro in projects) {
    pathRewrite[`^/${pro.identity}`] = "";
  }
  return router;
}

/**
 * 创建跳转路由
 * @param {*} projects
 */
function createRouter(projects) {
  projects = projects || [];
  let router = {};
  for (let pro in projects) {
    router[`^/${pro.identity}`] = pro.target;
  }
  return router;
}

app.use(
  proxy({
    pathRewrite: createPathRewrite(projects),
    router: createRouter(projects),
    changeOrigin: true
  })
);

app.listen(appConfig.port, () => {
  console.log(`Api Supervisor Server running on port ${appConfig.port}`);
});
