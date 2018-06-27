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
let apiStore = null;

beforeAll(done => {
  initModels();
  apiStore = require("../app/store/api").default;
  connect(done);
});

test("api add", async () => {
  const data = await apiStore.add({
    pro: "gp",
    url: "/v3_0/offshore/info",
    desc: "",
    method: "GET",
    paramsDeclare: []
  });
  console.log(data);
});

test("api list", async () => {
  const data = await apiStore.getList("gp");
  console.log(data);
});

test("api find one", async () => {
  const data = await apiStore.getOne("gp", "/v3_0/offshore/info", "GET");
  console.log(data);
});
