import db from "./dbInit";

export default {
  getOne: (identity, url) => {
    return db
      .get("apis")
      .find({ pro: identity, url })
      .value();
  }
};
