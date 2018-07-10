import Pipeline from "./index";
import { findApi, findApiStatus, findApiStack } from "./baseHandles";
import { storeProxiedServerBack } from "../service/apiService";
import { toJSONSchema } from "../../lib/utils";
import Repairer, { RepairItem } from "../repairer";
import jsondiffpatch, { diffpatcher } from "../../lib/jsondiffpatch";
import apiStackStore from "../store/apiStack";
const { wrap: async } = require("co");
const md5 = require("md5");

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
  const cloneProxiedServerBack = JSON.parse(JSON.stringify(proxiedServerBack));
  repairResult(delta, res, apiRes, cloneProxiedServerBack);
  const { apiStatus } = res.locals;
  //存储被代理接口数据
  storeProxiedServerBack(
    toJSONSchema(JSON.stringify(cloneProxiedServerBack)),
    cloneProxiedServerBack,
    apiStatus,
    {},
    undefined,
    delta !== undefined && !!hasDiff(delta)
  );
  // jsondiffpatch.console.log(delta);
  delta && !!hasDiff(delta) ? res.set("diff", JSON.stringify(delta)) : void 0;
  res.status("200").send(proxiedServerBack);
}

/**
 * 判断是否有差异
 * @param {*} delta
 */
function hasDiff(delta) {
  if (Array.isArray(delta)) {
    hasDiff.yes = true;
  } else if (typeof delta === "object") {
    Object.keys(delta).forEach(key => {
      return hasDiff(delta[key]);
    });
  }
  return hasDiff.yes;
}

/**
 * 修补接口结果与差异
 */
export function repairResult(delta, res, apiRes, proxiedServerBack) {
  const emptyArrayFields = []; //空数组字段路径统计
  let fillEmptyArray = false;
  //空数组提醒
  const emptyArrayWarn = new RepairItem(
    left => {
      if (left === "Array") return true;
    },
    right => {
      if (right === "Array") return true;
    },
    (diff, keyPaths) => {
      const keyPathStr = keyPaths.join(".");
      eval(`delete delta.${keyPathStr}`);
      emptyArrayFields.push(keyPathStr);
    }
  );

  //左边空数组修补
  const leftEmptyArrayRepair = new RepairItem(
    left => {
      if (left === "Array") return true;
    },
    right => {
      if (right["su-type"] && right["su-type"] === "Array") return true;
    },
    (diff, keyPaths) => {
      fillEmptyArray = true;
      const keyPathStr = keyPaths.join(".");
      eval(`delete delta.${keyPathStr}`);
      eval(`apiRes.result.${keyPathStr}=proxiedServerBack.${keyPathStr}`);
    }
  );

  //右边空数组忽略差异
  const rightEmptyArrayIgnore = new RepairItem(
    left => {
      if (left["su-type"] && left["su-type"] === "Array") return true;
    },
    right => {
      if (right === "Array") return true;
    },
    (diff, keyPaths) => {
      const keyPathStr = keyPaths.join(".");
      eval(`delete delta.${keyPathStr}`);
      eval(`proxiedServerBack.${keyPathStr}=apiRes.result.${keyPathStr}`);
    }
  );

  const repairer = new Repairer();
  repairer.regist(emptyArrayWarn);
  repairer.regist(leftEmptyArrayRepair);
  repairer.regist(rightEmptyArrayIgnore);
  repairer.execute(delta).after(() => {
    fillEmptyArray ? apiStackStore.update(apiRes) : !1;
    if (emptyArrayFields.length)
      res.set(`warn-emptyArray`, `Note:${emptyArrayFields} is a empty array`);
  });
}

const proxyPipeline = new Pipeline("proxy");
proxyPipeline.addHandleBackWrap([findApi, findApiStatus, findApiStack]);
proxyPipeline.addHandleBackWrap(async(handleProxyApiRes));

export default proxyPipeline;
