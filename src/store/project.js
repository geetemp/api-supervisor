import db from "./dbInit";

export default {
  /*获取项目列表
  */
  getList: () => {
    return db.get("projects").value();
  }
};
