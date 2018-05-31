import Pipeline from "./index";
import apiStackStore from "../store/apiStack";
import apiStatusStore from "../store/apiStatus";
import { findApi, findApiStatus, findApiStack } from "./baseHandles";
import { storeProxiedServerBack } from "../service/apiService";
import { toJSONSchema, getTimestamp } from "../utils";
var md5 = require("md5");
var jsondiffpatch = require("jsondiffpatch");

/**
 * 处理api代理返回结果
 * @description 代理接口结果与当前接口稳定版接口结果比较，如果有差异
 *              则存储代理接口结果为head版
 * @param {*} req
 * @param {*} res
 */
function handleProxyApiRes(req, res) {
  const { proxiedServerBack, apiRes } = res.locals;
  const proxiedSBackSchema = toJSONSchema(JSON.stringify(proxiedServerBack));
  const delta = jsondiffpatch.diff(
    toJSONSchema(JSON.stringify(apiRes.result)),
    proxiedSBackSchema
  );
  //有差异
  if (delta) {
    const { apiStatus } = res.locals;
    storeProxiedServerBack(proxiedSBackSchema, proxiedServerBack, apiStatus);
  }
  jsondiffpatch.console.log(delta);
}

function response(req, res) {
  const { proxiedServerBack } = res.locals;
  res.json(proxiedServerBack);
}

const proxyPipeline = new Pipeline("proxy");
proxyPipeline.addHandleBackWrap([findApi, findApiStatus, findApiStack]);
proxyPipeline.addHandleBackWrap(handleProxyApiRes);

export default proxyPipeline;
