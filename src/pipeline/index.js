import { isArray } from "../utils";

/**
 * 处理管道
 */
export default class Pipeline {
  findProject = (req, res) => {};
  findApi = (req, res) => {};
  findApiStack = (req, res) => {};
  handleBackActionList = [];

  init(findProject, findApi, findApiStack) {
    this.findProject = findProject;
    this.findApi = findApi;
    this.findApiStack = findApiStack;
  }

  addHandleBackWrap(handle) {
    this.handleBackActionList.push(handle);
  }

  checkActionResult(res) {
    return !isArray(res);
  }

  execute(req, res) {
    const { findProject, findApi, findApiStack, handleBackActionList } = this;
    const executeActionList = [
      findProject,
      findApi,
      findApiStack,
      ...handleBackActionList
    ];
    for (const executeAction of executeActionList) {
      if (executeAction) {
        const actionResult = executeAction(req, res);
        if (actionResult === undefined)
          throw new Error("Action must return value");
        if (!this.checkActionResult(actionResult))
          throw new Error("back has only one");
      }
    }
  }
}
