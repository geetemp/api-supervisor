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
let apiStatusStore = null;
let apiStore = null;

beforeAll(done => {
  initModels();
  apiStatusStore = require("../app/store/apiStatus").default;
  apiStore = require("../app/store/api").default;
  connect(done);
});

test("apiStatus add", async () => {
  const api = await apiStore.getOne("gp", "/v3_0/offshore/info", "GET");
  const data = await apiStatusStore.add({
    status: 0,
    apiId: api.id,
    head: "",
    stable: ""
  });
  console.log(data);
});

test("apiStatus list by apiId", async () => {
  const api = await apiStore.getOne("gp", "/v3_0/offshore/info", "GET");
  const data = await apiStatusStore.getListByApiId(api.id);
  console.log(data);
});

test("apiStatus getOneByApiStatus", async () => {
  const api = await apiStore.getOne("gp", "/v3_0/offshore/info", "GET");
  const data = await apiStatusStore.getOneByApiStatus(api.id, 0);
  console.log(data);
});

test("apiStatus updateHead", async () => {
  const api = await apiStore.getOne("gp", "/v3_0/offshore/info", "GET");
  const apiStatus = await apiStatusStore.getOneByApiStatus(api.id, 0);
  const data = await apiStatusStore.updateHead(
    apiStatus.id,
    0,
    "eaf5bdddd8d5fa81a63246975fb3bba8"
  );
  console.log(data);
});

test("apiStatus updateStable", async () => {
  const api = await apiStore.getOne("gp", "/v3_0/offshore/info", "GET");
  const apiStatus = await apiStatusStore.getOneByApiStatus(api.id, 0);
  const data = await apiStatusStore.updateStable(
    apiStatus.id,
    0,
    "caf5bdddd8d5fa81a63246975fb3bba7"
  );
  console.log(data);
});
