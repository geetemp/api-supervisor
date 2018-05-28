import { isArray } from "../utils";

export class Back {
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
    const executeActionList = [
      findProject,
      findApi,
      findApiStack,
      ...handleBackActionList
    ];
    for (const executeAction of executeActionList) {
      const actionResult = executeAction();
      if (actionResult === undefined)
        throw new Error("Action must return value");
      if (checkActionResult(actionResult)) throw new Error("back has only one");
    }
  }
}
