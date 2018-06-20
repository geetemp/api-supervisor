import db from "./dbInit";
import { filterUndefined } from "../utils";
var shortid = require("shortid");

export default {
  getOne: (pro, url, method) => {
    return db
      .get("apis")
      .find({ pro, url, method })
      .value();
  },

  add: api => {
    api.id = shortid.generate();
    const apiList = db
      .get("apis")
      .push(api)
      .write();
    return apiList[apiList.length - 1];
  },

  getList: (pro, url, method) => {
    return db
      .get("apis")
      .filter(filterUndefined({ pro, url, method }))
      .map(item => {
        return { url: item.url, method: item.method };
      })
      .value();
  }
};
