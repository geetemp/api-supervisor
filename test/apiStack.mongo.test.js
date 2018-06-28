const fs = require("fs");
const join = require("path").join;
const mongoose = require("mongoose");

/**
 * 数据库初始化
 */
function initModels() {
  const models = join(__dirname, "../app/models");

  // Bootstrap models
  fs.readdirSync(models)
    .filter(file => {
      console.log(file);
      return ~file.search(/^[^\.].*\.js$/);
    })
    .forEach(file => require(join(models, file)));
}

//mongodb connect
function connect(done) {
  const connectPromise = mongoose.connect("mongodb://127.0.0.1/api-supervisor");
  const db = mongoose.connection;
  db.on("error", console.log);
  db.once("open", () => {
    done();
  });
}
let apiStackStore = null;
let apiStatusStore = null;
let apiStore = null;

beforeAll(done => {
  initModels();
  apiStackStore = require("../app/store/apiStack").default;
  apiStatusStore = require("../app/store/apiStatus").default;
  apiStore = require("../app/store/api").default;
  connect(done);
});

test("apiStack add", async () => {
  const api = await apiStore.getOne("gp", "/v3_0/offshore/info", "GET");
  const apiStatus = await apiStatusStore.getOneByApiStatus(api.id, 0);

  const data = await apiStackStore.addStack({
    id: "caf5bdddd8d5fa81a63246975fb3bba8",
    apiStatusId: apiStatus.id,
    params: {},
    resultDeclare: [],
    result: {
      code: 0,
      msg: "OK",
      data: {
        age: 28,
        price_base: "7500"
      }
    }
  });
  console.log(data);
});

test("apiStack getStackById", async () => {
  const data = await apiStackStore.getStackById(
    "caf5bdddd8d5fa81a63246975fb3bba8"
  );
  console.log(data);
});

test("apiStack getHeadStack", async () => {
  const data = await apiStackStore.getStackById(
    "caf5bdddd8d5fa81a63246975fb3bba8"
  );
  console.log(data);
});

test("apiStack getStackByIdAndApiStatusId", async () => {
  const api = await apiStore.getOne("gp", "/v3_0/offshore/info", "GET");
  const apiStatus = await apiStatusStore.getOneByApiStatus(api.id, 0);
  const data = await apiStackStore.getStackByIdAndApiStatusId(
    "caf5bdddd8d5fa81a63246975fb3bba8",
    apiStatus.id
  );
  console.log(data);
});

test("apiStack getStackByApiStatusId", async () => {
  const api = await apiStore.getOne("gp", "/v3_0/offshore/info", "GET");
  const apiStatus = await apiStatusStore.getOneByApiStatus(api.id, 0);
  console.log("apiStatusId", apiStatus.id);
  const data = await apiStackStore.getStackByApiStatusId(apiStatus.id);
  console.log(data);
});
