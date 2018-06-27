const mongoose = require("mongoose");
const Project = mongoose.model("Project");
const { wrap: async } = require("co");

export default {
  /*获取项目列表
  */
  getList: async(function*() {
    return yield Project.find({});
  }),

  /**
   * 根据host名查找项目
   */
  getOneByhost: async(function*(host) {
    return yield Project.findOne({ "proxy.target": host }).lean();
  }),

  /**
   * 根据identity查找项目
   */
  getOneByIdentity: async(function*(identity) {
    return yield Project.findOne({ identity }).lean();
  }),

  /**
   * 添加一个项目
   */
  addOne: async(function*(project) {
    const projectModel = new Project();
    Object.assign(projectModel, project);
    return yield projectModel.save();
  }),

  /**
   * 更新代理状态
   */
  update: async(function*(project) {
    const { identity, target, status = 1, name } = project;
    const willUpdateDoc = {};
    if (target) {
      willUpdateDoc["proxy.target"] = target;
    }
    if (status !== undefined) {
      willUpdateDoc["proxy.status"] = status;
    }
    if (name) {
      willUpdateDoc["name"] = name;
    }
    yield Project.updateOne({ identity }, willUpdateDoc);
    return yield Project.findOne({ identity }).lean();
  })
};
