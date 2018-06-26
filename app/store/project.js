const mongoose = require("mongoose");
const Project = mongoose.model("Project");
const { wrap: async } = require("co");

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
  },

  /**
   * 添加一个项目
   */
  addOne: async(function*(project) {
    const projectModel = new Project();
    Object.assign(projectModel, project);
    yield projectModel.save();
  }),

  /**
   * 更新代理状态
   */
  update: project => {
    const { identity, target, status = 1, name } = project;
    const underUpdatePro = db
      .get("projects")
      .find(item => {
        return item.identity === identity;
      })
      .value();
    return db
      .get("projects")
      .find(item => {
        return item.identity === identity;
      })
      .set("name", name ? name : underUpdatePro.name)
      .set("proxy.target", target ? target : underUpdatePro.proxy.target)
      .set(
        "proxy.status",
        status !== undefined ? status : underUpdatePro.proxy.status
      )
      .write();
  }
};
