import apiStore from "../store/api";
import apiStackStore from "../store/apiStack";
import apiStatusStore from "../store/apiStatus";
/**
 * 查找Api
 * @param {*} req
 * @param {*} res
 */
function findApi(req, res) {
  let { baseUrl, path } = req;
  const api = apiStore.getOne(baseUrl.substring(1), path);
  res.locals.api = api;
}

/**
 * 查找Api Status
 * @param {*} req
 * @param {*} res
 */
function findApiStatus(req, res) {
  const { api, supervisorStatus } = res.locals;
  res.locals.apiStatus = apiStatusStore.getOneByApiStatus(
    api.id,
    supervisorStatus
  );
}

/**
 * 查找某个接口的返回结果
 * @param {*} req
 * @param {*} res
 */
function findApiStack(req, res) {
  const { apiStatus } = res.locals;
  const apiRes = apiStackStore.getHeadStack(apiStatus.stable);
  res.locals.apiRes = apiRes;
}

/**
 * log
 * @param {*} req
 * @param {*} res
 */
function logApiStack(req, res) {
  console.log("logApiStack", res.locals.apiRes);
}

/**
 * response client
 * @param {*} req
 * @param {*} res
 */
function response(req, res) {
  res.json(res.locals.apiRes.result);
}

export { findApi, findApiStatus, findApiStack, logApiStack, response };
