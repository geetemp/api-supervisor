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
  let pathRewrite = {},
    proxy = {};
  for (let pro of projects) {
    proxy = pro.proxy;
    proxy.status ? (pathRewrite[`^/${pro.identity}`] = "") : void 0;
  }
  console.log(pathRewrite);
  return pathRewrite;
}

/**
 * 创建跳转路由
 * @param {*} projects
 */
function createRouter(projects) {
  projects = projects || [];
  let router = {},
    proxy = {};
  for (let pro of projects) {
    proxy = pro.proxy;
    proxy.status ? (router[`/${pro.identity}`] = proxy.target) : void 0;
  }
  return router;
}

app.use(
  proxy({
    target: "http://www.geetemp.com",
    pathRewrite: createPathRewrite(projects),
    router: createRouter(projects),
    changeOrigin: true,
    onProxyRes: (proxyRes, req, res) => {
      // console.log("proxyRes", proxyRes);
      // console.log("-------------------------------------------");
      // console.log("req", req);
      // console.log("-------------------------------------------");
      // console.log("res", res);
    }
  })
);

app.listen(appConfig.port, () => {
  console.log(`Api Supervisor Server running on port ${appConfig.port}`);
});
