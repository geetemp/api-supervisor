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
    const apiStackList = db
      .get("apiStack")
      .push(stack)
      .write();
    return apiStackList[apiStackList.length - 1];
  },

  getStackById: id => {
    return db
      .get("apiStack")
      .find({ id })
      .value();
  },

  /**
   * 根据Id和apiStatusId获取stack
   */
  getStackByIdAndApiStatusId: (id, apiStatusId) => {
    return db
      .get("apiStack")
      .find({ id, apiStatusId })
      .value();
  },

  /**
   * 根据apiStatusId获取stack List
   */
  getStackByApiStatusId: apiStatusId => {
    return db
      .get("apiStack")
      .filter({ apiStatusId })
      .value();
  }
};

export default apiStack;
