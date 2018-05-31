import apiStackStore from "../store/apiStack";
import apiStatusStore from "../store/apiStatus";
var md5 = require("md5");

/**
 * 保存新的被代理服务器返回结果
 */
function storeProxiedServerBack(
  proxiedSBackSchema,
  proxiedServerBack,
  apiStatus,
  params = {},
  init = false
) {
  const id = md5(proxiedSBackSchema);
  if (!apiStackStore.getStackById(id)) {
    //生成待存储stack
    const willStoreStack = {
      id,
      apiStatusId: apiStatus.id,
      params,
      result: proxiedServerBack,
      timestamp: getTimestamp()
    };

    apiStackStore.addStack(willStoreStack);
    apiStatusStore.updateHead(apiStatus.id, apiStatus.status, id);
    init && apiStatusStore.updateStable(apiStatus.id, apiStatus.status, id);
    return willStoreStack;
  }
}

export { storeProxiedServerBack };
