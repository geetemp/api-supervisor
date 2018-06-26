import db from "./dbInit";
var shortid = require("shortid");

export default {
  getOneByApiStatus: (apiId, status) => {
    return db
      .get("apiStatus")
      .find({ apiId: apiId, status })
      .value();
  },

  updateHead: (apiStatusId, status, head) => {
    return db
      .get("apiStatus")
      .find({ id: apiStatusId, status })
      .assign({ head })
      .write();
  },

  updateStable: (apiStatusId, status, stable) => {
    return db
      .get("apiStatus")
      .find({ id: apiStatusId, status })
      .assign({ stable })
      .write();
  },

  add: apiStatus => {
    apiStatus.id = shortid.generate();
    const apiStatusList = db
      .get("apiStatus")
      .push(apiStatus)
      .write();
    return apiStatusList[apiStatusList.length - 1];
  },

  getListByApiId: apiId => {
    return db
      .get("apiStatus")
      .filter({ apiId })
      .value();
  }
};
