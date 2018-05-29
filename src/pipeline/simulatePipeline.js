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

function response(req, res) {
  res.json(res.locals.apiRes.result);
  return res.locals.apiRes.result;
}

const simulatePipeline = new Pipeline();
simulatePipeline.init(undefined, findApi, findApiStack);
simulatePipeline.addHandleBackWrap(logApiStack);
simulatePipeline.addHandleBackWrap(response);

export default simulatePipeline;
