import express from "express";
import proxy from "http-proxy-middleware";
import proxyPipeline from "./pipeline/proxyPipeline";
import logger from "./logger";
import { setReqPath } from "./utils";
import cache from "./cache";

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
  const proxyPaths = getProxyPaths(cache.getState().projects);
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
  const proxyPaths = getProxyPaths(cache.getState().projects);
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
    routers = createRouter(cache.getState().projects),
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
    onProxyRes: (proxyRes, req, res) => {
      const contentType = proxyRes.headers["content-type"];
      const setCookie = proxyRes.headers["set-cookie"];
      if (setCookie) res.append("set-cookie", setCookie);
      let proxiedServerBack = Buffer.from([]);
      proxyRes.on("data", data => {
        proxiedServerBack = Buffer.concat([proxiedServerBack, data]);
      });
      proxyRes.on("end", () => {
        try {
          setReqPath(req.originalUrl.split("?")[0], req);
          if (contentType === "application/json") {
            const proxiedSBackObj = JSON.parse(
              proxiedServerBack.toString("utf8")
            );
            res.locals.proxiedServerBack = proxiedSBackObj;
            //supervisorStatus 接口状态，根据接口状态，返回不同的数据结构
            res.locals.supervisorStatus =
              proxiedSBackObj[appConfig.resStatusKey];
            async(proxyPipeline.execute)
              .apply(proxyPipeline, [req, res])
              .catch(err => {
                console.error(err);
                logger.error(err);
                res.status(500).send("Sorry,server something broke!");
              });
          } else {
            res.status("200").send(proxiedServerBack);
          }
        } catch (err) {
          console.error(err);
          logger.error(err);
          res.status(500).send("Sorry,server something broke!");
        }
      });
    }
  })
);

export default app;
