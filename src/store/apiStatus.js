import db from "./dbInit";
var shortid = require("shortid");

export default {
  getOneByApiStatus: (apiId, status) => {
    return db
      .get("apiStatus")
      .find({ id: apiId, status })
      .value();
  },

  updateHead: (apiId, status, head) => {
    return db
      .get("apiStatus")
      .find({ id: apiId, status })
      .assign({ head })
      .write();
  },

  updateStable: (apiId, status, stable) => {
    return db
      .get("apiStatus")
      .find({ id: apiId, status })
      .assign({ stable })
      .write();
  },

  add: apiStatus => {
    apiStatus.id = shortid.generate();
    return db
      .get("apiStatus")
      .push(apiStatus)
      .write();
  }
};
