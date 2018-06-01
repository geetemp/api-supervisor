import db from "./dbInit";

const apiStack = {
  /**
   * 获取栈head信息
   */
  getHeadStack: head => {
    return apiStack.getStackById(head);
  },

  /**
   * 新增一个stack
   */
  addStack: stack => {
    return db
      .get("apiStack")
      .push(stack)
      .write()[0];
  },

  /**
   * 根据Id获取stack
   */
  getStackById: id => {
    return db
      .get("apiStack")
      .find({ id: id })
      .value();
  }
};

export default apiStack;
