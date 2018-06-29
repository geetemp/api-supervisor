const mongoose = require("mongoose");
const ApiStack = mongoose.model("ApiStack");
const { wrap: async } = require("co");

const apiStack = {
  /**
   * 获取栈head信息
   */
  getHeadStack: async(function*(head) {
    return yield ApiStack.findOne({ id: head }).lean();
  }),

  /**
   * 新增一个stack
   */
  addStack: async(function*(stack) {
    const apiStackModel = new ApiStack();
    Object.assign(apiStackModel, stack);
    return yield apiStackModel.save();
  }),

  /**
   * 根据Id查询apiStack
   */
  getStackById: async(function*(id) {
    return yield ApiStack.findOne({ id }).lean();
  }),

  /**
   * 根据Id和apiStatusId获取stack
   */
  getStackByIdAndApiStatusId: async(function*(id, apiStatusId) {
    return yield ApiStack.findOne({ id, apiStatusId }).lean();
  }),

  /**
   * 根据apiStatusId获取stack List
   */
  getStackByApiStatusId: async(function*(apiStatusId) {
    return yield ApiStack.find({ apiStatusId }).lean();
  })
};

export default apiStack;
