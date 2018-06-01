import db from "./dbInit";
var shortid = require("shortid");

export default {
  getOne: (identity, url) => {
    return db
      .get("apis")
      .find({ pro: identity, url })
      .value();
  },
  add: api => {
    api.id = shortid.generate();
    return db
      .get("apis")
      .push(api)
      .write()[0];
  }
};
