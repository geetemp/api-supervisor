import { isArray } from "../utils";

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

  execute(req, res) {
    const { handleBackActionList } = this;
    for (const executeAction of handleBackActionList) {
      // if (executeAction) {
      executeAction && executeAction(req, res, type);
      // if (actionResult === undefined)
      //   throw new Error("Action must return value");
      // if (!this.checkActionResult(actionResult))
      //   throw new Error("back has only one");
      // }
    }
  }
}