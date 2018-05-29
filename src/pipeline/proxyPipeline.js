import Pipeline from "./index";
import projectStore from "../store/project";
import apiStore from "../store/api";
import apiStackStore from "../store/apiStack";

/**
 * 查找Api
 * @param {*} req
 * @param {*} res
 */
function findApi(req, res) {
  let { baseUrl, path } = req;
  const api = apiStore.getOne(baseUrl.substring(1), path);
  res.locals.api = api;
  return api;
}

/**
 * 查找某个接口的返回结果
 * @param {*} req
 * @param {*} res
 */
function findApiStack(req, res) {
  const { api } = res.locals;
  const apiRes = apiStackStore.getHeadStack(api.stable);
  res.locals.apiRes = apiRes;
  return apiRes;
}

function logApiStack(req, res) {
  console.log("logApiStack", res.locals.apiRes);
  return res.locals.apiRes;
}

/**
 * 处理api代理返回结果
 * @description 代理接口结果与当前接口稳定版接口结果比较，如果有差异
 *              则存储代理接口结果为head版
 * @param {*} req
 * @param {*} res
 */
function handleProxyApiRes(req, res) {
  const { proxiedServerBack, apiRes } = res.locals;
}

const proxyPipeline = new Pipeline();
proxyPipeline.init(undefined, findApi, findApiStack);
proxyPipeline.addHandleBackWrap(logApiStack);
proxyPipeline.addHandleBackWrap(response);

export default proxyPipeline;
