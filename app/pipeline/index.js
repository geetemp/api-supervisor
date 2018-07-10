import { isArray } from "../../lib/utils";

/**
 * 处理管道
 */
export default class Pipeline {
  type = "proxy";
  handleBackActionList = [];

  constructor(type) {
    this.type = type;
  }

  addHandleBackWrap(handle) {
    !isArray(handle)
      ? this.handleBackActionList.push(handle)
      : (this.handleBackActionList = this.handleBackActionList.concat(handle));
  }

  checkActionResult(res) {
    return !isArray(res);
  }

  *execute(req, res) {
    const { handleBackActionList, type } = this;
    for (const executeAction of handleBackActionList) {
      const isContinue = yield executeAction(req, res, type);
      if (!isContinue) break;
    }
  }
}
