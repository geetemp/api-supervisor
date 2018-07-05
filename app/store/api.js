import { filterUndefined } from "../utils";
const mongoose = require("mongoose");
const Api = mongoose.model("Api");
const { wrap: async } = require("co");

export default {
  getOne: async(function*(pro, url, method) {
    return yield Api.findOne(filterUndefined({ pro, url, method }));
  }),

  add: async(function*(api) {
    const apiModel = new Api();
    Object.assign(apiModel, api, { id: mongoose.Types.ObjectId() });
    return yield apiModel.save();
  }),

  getList: async(function*(pro, url, method) {
    return yield Api.find(filterUndefined({ pro, url, method })).select(
      "url method"
    );
  })
};
