import db from "./dbInit";

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
  }
};
