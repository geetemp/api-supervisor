import express from "express";
import proxy from "http-proxy-middleware";
import projectStore from "./store/project";
import proxyPipeline from "./pipeline/proxyPipeline";
import http from "http";
import { toJSONSchema, IsJsonString, setReqPath } from "./utils";

const app = express();
const appConfig = require("../config");
const { wrap: async } = require("co");

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
    proxy.status ? (router[`^/${pro.identity}`] = proxy.target) : void 0;
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

/**
 * 过滤代理路径
 * @param {*} pathname
 * @param {*} req
 */
const filter = function(pathname, req) {
  const proxyPaths = getProxyPaths(projectStore.getList());
  let isMath = false;
  for (const proxyPath of proxyPaths) {
    if (pathname.match(proxyPath)) return (isMath = true);
  }
  return isMath;
};

/**
 * 请求地址重写
 * @param {*} pathname
 * @param {*} req
 */
const getPathRewrite = function(pathname, req) {
  const proxyPaths = getProxyPaths(projectStore.getList());
  for (const proxyPath of proxyPaths) {
    //如果请求地址匹配代理路径，则重写请求地址
    if (pathname.match(proxyPath)) {
      return pathname.replace(new RegExp(proxyPath), "");
    }
  }
};

/**
 * 路由重写
 * @param {*} req
 */
const getRouter = function(req) {
  const path = req.path,
    routers = createRouter(projectStore.getList()),
    pathMathExps = Object.keys(routers);
  for (const pathMathExp of pathMathExps) {
    if (path.match(pathMathExp)) {
      return routers[pathMathExp];
    }
  }
};

//走代理路由
app.use(
  proxy(filter, {
    target: appConfig.proxyTarget,
    pathRewrite: getPathRewrite,
    router: getRouter,
    changeOrigin: true,
    selfHandleResponse: true,
    //IncomingMessage,IncomingMessage,ServerResponse
    onProxyRes: (proxyRes, req, res) => {
      proxyRes.setEncoding(appConfig.encoding);
      let proxiedServerBack = "";
      proxyRes.on("data", data => {
        proxiedServerBack += data;
      });
      proxyRes.on("end", () => {
        try {
          setReqPath(req.originalUrl.split("?")[0], req);
          if (IsJsonString(proxiedServerBack)) {
            const proxiedSBackObj = JSON.parse(proxiedServerBack);
            res.locals.proxiedServerBack = proxiedSBackObj;
            //supervisorStatus 接口状态，根据接口状态，返回不同的数据结构
            res.locals.supervisorStatus =
              proxiedSBackObj[appConfig.resStatusKey];
            async(proxyPipeline.execute)(req, res);
            // console.log(
            //   "toJSONSchema",
            //   JSON.stringify(toJSONSchema(proxiedServerBack))
            // );
            // console.log(proxyRes.req.agent);
            // const { protocol } = proxyRes.req.agent;
            // console.log(protocol, proxyRes.req.getHeader("host") + req.url);
            // console.log(req.baseUrl, req.path);
          } else {
            res.status("403").send(proxiedServerBack);
          }
        } catch (e) {
          res.status(500).send(`${e.messge} \n ${e.stack}`);
          console.log(e);
        }
      });
    }
  })
);

export default app;
