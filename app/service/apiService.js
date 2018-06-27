import apiStackStore from "../store/apiStack";
import apiStatusStore from "../store/apiStatus";
import { getTimestamp, sortObjectKeys } from "../utils";
const md5 = require("md5");
const { wrap: async } = require("co");

/**
 * 保存新的被代理服务器返回结果
 * @param {*} proxiedSBackSchema 被代理服务器端接口返回Json的Schema
 * @param {*} proxiedServerBack  被代理服务器端接口返回Json
 * @param {*} apiStatus  接口状态数据
 * @param {*} params  请求参数
 * @param {*} init    是否是初始化添加
 * @param {*} isDiff  是否存在差异
 */
function* storeProxiedServerBack(
  proxiedSBackSchema,
  proxiedServerBack,
  apiStatus,
  params = {},
  init = false,
  isDiff = true
) {
  //Json Schema按字母排序,并计算md5
  const id = md5(JSON.stringify(sortObjectKeys(proxiedSBackSchema)));
  //如果没有则新增一个apiStack作为head
  const apiStack = yield apiStackStore.getStackByIdAndApiStatusId(
    id,
    apiStatus.id
  );
  if (isDiff && !apiStack) {
    //生成待存储stack
    const willStoreStack = {
      id,
      apiStatusId: apiStatus.id,
      params,
      resultDeclare: [],
      result: proxiedServerBack,
      timestamp: getTimestamp()
    };

    apiStackStore.addStack(willStoreStack);
    apiStatusStore.updateHead(apiStatus.id, apiStatus.status, id);
    init && apiStatusStore.updateStable(apiStatus.id, apiStatus.status, id);
    return willStoreStack;
  } else {
    apiStatusStore.updateHead(apiStatus.id, apiStatus.status, id);
  }
}

storeProxiedServerBack = async(storeProxiedServerBack);

export { storeProxiedServerBack };
