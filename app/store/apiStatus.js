const mongoose = require("mongoose");
const ApiStatus = mongoose.model("ApiStatus");
const { wrap: async } = require("co");

export default {
  /**
   * 根据api status查询一个接口状态
   */
  getOneByApiStatus: async(function*(apiId, status) {
    return yield ApiStatus.findOne({ apiId, status });
  }),

  /**
   * 更新Head字段
   */
  updateHead: async(function*(apiStatusId, status, head) {
    yield ApiStatus.updateOne({ id: apiStatusId, status }, { head });
    return yield ApiStatus.findOne({ id: apiStatusId }).lean();
  }),

  /**
   * 更新stable字段
   */
  updateStable: async(function*(apiStatusId, status, stable) {
    yield ApiStatus.updateOne({ id: apiStatusId, status }, { stable });
    return yield ApiStatus.findOne({ id: apiStatusId }).lean();
  }),

  /**
   * 新增接口状态
   */
  add: async(function*(apiStatus) {
    const apiStatusModel = new ApiStatus();
    Object.assign(apiStatusModel, apiStatus, { id: mongoose.Types.ObjectId() });
    return yield apiStatusModel.save();
  }),

  /**
   * 根据api id 查询接口状态列表
   */
  getListByApiId: async(function*(apiId) {
    return yield ApiStatus.find({ apiId });
  })
};
