import express from "express";
import proxy from "http-proxy-middleware";
import projectStore from "./store/project";
import simulatePipeline from "./pipeline/simulatePipeline";
import { toJSONSchema } from "./utils";

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

/**
 * 获取需要代理的路径
 * @param {*} projects
 */
function getProxyPaths(projects) {
  projects = projects || [];
  let proxyPaths = [],
    proxy = {};
  for (let pro of projects) {
    proxy = pro.proxy;
    proxy.status ? proxyPaths.push(`^/${pro.identity}`) : void 0;
  }
  return proxyPaths;
}

function getSimulatePaths(projects) {
  projects = projects || [];
  let simulatePaths = [],
    proxy = {};
  for (let pro of projects) {
    proxy = pro.proxy;
    !proxy.status ? simulatePaths.push(`^/${pro.identity}`) : void 0;
  }
  return simulatePaths;
}

const simulatePaths = getSimulatePaths(projects);
const proxyPaths = getProxyPaths(projects);

//走代理路由
proxyPaths.length &&
  app.use(
    proxyPaths,
    proxy({
      target: appConfig.proxyTarget,
      pathRewrite: createPathRewrite(projects),
      router: createRouter(projects),
      changeOrigin: true,
      //IncomingMessage,IncomingMessage,ServerResponse
      onProxyRes: (proxyRes, req, res) => {
        proxyRes.setEncoding(appConfig.encoding);
        let proxiedServerBack = "";
        proxyRes.on("data", data => {
          proxiedServerBack += data;
        });
        proxyRes.on("end", () => {
          console.log(proxiedServerBack);
          console.log(
            "toJSONSchema",
            JSON.stringify(toJSONSchema(proxiedServerBack))
          );
          // console.log(proxyRes.req.agent);
          // const { protocol } = proxyRes.req.agent;
          // console.log(protocol, proxyRes.req.getHeader("host") + req.url);
          // console.log(req.baseUrl, req.path);
        });
      }
    })
  );

//走模拟接口路由
simulatePaths &&
  app.use(simulatePaths, (req, res) => {
    simulatePipeline.execute(req, res);
  });

app.listen(appConfig.port, () => {
  console.log(`Api Supervisor Server running on port ${appConfig.port}`);
});
