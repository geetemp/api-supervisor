import db from "./dbInit";

export default {
  /*获取项目列表
  */
  getList: () => {
    return db.get("projects").value();
  },

  /**
   * 根据host名查找项目
   */
  getOneByhost: host => {
    return db
      .get("projects")
      .find(item => {
        return item.proxy.target === host;
      })
      .value();
  },

  /**
   * 根据identity查找项目
   */
  getOneByIdentity: identity => {
    return db
      .get("projects")
      .find(item => {
        return item.identity === identity;
      })
      .value();
  }
};
