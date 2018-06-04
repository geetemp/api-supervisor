import db from "./dbInit";
var shortid = require("shortid");

export default {
  getOne: (identity, url, method) => {
    return db
      .get("apis")
      .find({ pro: identity, url, method })
      .value();
  },
  add: api => {
    api.id = shortid.generate();
    const apiList = db
      .get("apis")
      .push(api)
      .write();
    return apiList[apiList.length - 1];
  }
};
