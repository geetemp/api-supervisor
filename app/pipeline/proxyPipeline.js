import Pipeline from "./index";
import { findApi, findApiStatus, findApiStack } from "./baseHandles";
import { storeProxiedServerBack } from "../service/apiService";
import { toJSONSchema } from "../../lib/utils";
import jsondiffpatch, { diffpatcher } from "../../lib/jsondiffpatch";
const { wrap: async } = require("co");

/**
 * 处理api代理返回结果
 * @description 代理接口结果与当前接口稳定版接口结果比较，如果有差异
 *              则存储代理接口结果为head版
 * @param {*} req
 * @param {*} res
 */
function* handleProxyApiRes(req, res) {
  const { proxiedServerBack, apiRes } = res.locals;
  const proxiedSBackSchema = toJSONSchema(JSON.stringify(proxiedServerBack));
  const apiResSchema = toJSONSchema(JSON.stringify(apiRes.result));
  const delta = diffpatcher.diff(apiResSchema, proxiedSBackSchema);

  const { apiStatus } = res.locals;
  //存储被代理接口数据
  storeProxiedServerBack(
    proxiedSBackSchema,
    proxiedServerBack,
    apiStatus,
    {},
    undefined,
    delta !== undefined
  );
  // jsondiffpatch.console.log(delta);
  console.log(delta);
  delta ? res.set("diff", JSON.stringify(delta)) : void 0;
  res.status("200").send(proxiedServerBack);
}

function response(req, res) {
  const { proxiedServerBack } = res.locals;
  res.json(proxiedServerBack);
}

const proxyPipeline = new Pipeline("proxy");
proxyPipeline.addHandleBackWrap([findApi, findApiStatus, findApiStack]);
proxyPipeline.addHandleBackWrap(async(handleProxyApiRes));

export default proxyPipeline;
