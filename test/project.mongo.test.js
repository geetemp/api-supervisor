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
let projectStore = null;

beforeAll(done => {
  initModels();
  projectStore = require("../app/store/project").default;
  connect(done);
});

test("project add", async () => {
  const data = await projectStore.addOne({
    name: "即派",
    identity: "gp",
    proxy: {
      target: "http://www.geetemp.com",
      status: 0
    }
  });
  console.log(data);
});

test("project list", async () => {
  const data = await projectStore.getList();
  console.log(data);
});

test("find project based host name", async () => {
  const data = await projectStore.getOneByhost("http://www.geetemp.com");
  console.log(data);
});

test("find project based identity", async () => {
  const data = await projectStore.getOneByIdentity("gp");
  console.log(data);
});

test("update project", async () => {
  const data = await projectStore.update({
    identity: "gp",
    target: "http://baidu.com",
    status: 0,
    name: "改变即派名称"
  });
  console.log(data);
});
