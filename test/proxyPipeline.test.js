import proxyPipeline from "../src/pipeline/proxyPipeline";
import db from "../src/store/dbInit";

let res = {};
let req = {};

beforeAll(() => {
  db.set("apis", []).write();
  db.set("apiStatus", []).write();
  db.set("apiStack", []).write();

  db.set("projects.proxy.status", 1).write();

  res.status = function(httpStatus) {
    return res;
  };
  res.send = function(str) {};
  res.locals = {};
  req.baseUrl = "/jp";
  req.path = "/v3_0/offshore/info";
  req.method = "GET";
});

test("no mock data,init api data", () => {
  const proxiedSBackObj = {
    code: 0,
    data: { price_base: 7500 },
    msg: "OK"
  };
  res.locals.proxiedServerBack = proxiedSBackObj;
  //supervisorStatus 接口状态，根据接口状态，返回不同的数据结构
  res.locals.supervisorStatus = proxiedSBackObj["code"];
  proxyPipeline.execute(req, res);
  expect(db.get("apiStack").value()[0].id).toBe(
    db.get("apiStatus").value()[0].head
  );
  expect(db.get("apiStack").value()[0].id).toBe(
    db.get("apiStatus").value()[0].stable
  );
});

test("add diff status data", () => {
  const proxiedSBackObj = {
    code: 1,
    msg: "提交失败"
  };
  res.locals.proxiedServerBack = proxiedSBackObj;
  //supervisorStatus 接口状态，根据接口状态，返回不同的数据结构
  res.locals.supervisorStatus = proxiedSBackObj["code"];
  proxyPipeline.execute(req, res);
  expect(db.get("apiStatus").value()[1].status).toBe(1);
  expect(db.get("apiStack").value()[1].id).toBe(
    db.get("apiStatus").value()[1].head
  );
  expect(db.get("apiStack").value()[1].id).toBe(
    db.get("apiStatus").value()[1].stable
  );
});

test("change status 0 apiStack data", () => {
  const proxiedSBackObj = {
    code: 0,
    data: { price_bases: 7500 },
    msg: 3
  };
  res.locals.proxiedServerBack = proxiedSBackObj;
  //supervisorStatus 接口状态，根据接口状态，返回不同的数据结构
  res.locals.supervisorStatus = proxiedSBackObj["code"];
  proxyPipeline.execute(req, res);
  expect(db.get("apiStack").value()[2].id).toBe(
    db.get("apiStatus").value()[0].head
  );
  expect(db.get("apiStack").value()[0].id).toBe(
    db.get("apiStatus").value()[0].stable
  );
});

test("recover status 0 apiStack data", () => {
  const proxiedSBackObj = {
    code: 0,
    data: { price_base: 7500 },
    msg: "OK"
  };
  res.locals.proxiedServerBack = proxiedSBackObj;
  //supervisorStatus 接口状态，根据接口状态，返回不同的数据结构
  res.locals.supervisorStatus = proxiedSBackObj["code"];
  proxyPipeline.execute(req, res);
  expect(db.get("apiStack").value()[0].id).toBe(
    db.get("apiStatus").value()[0].head
  );
  expect(db.get("apiStack").value()[0].id).toBe(
    db.get("apiStatus").value()[0].stable
  );
  expect(db.get("apiStack").value()[3]).toBe(undefined);
});

test("same url & diff method in same project", () => {
  req.baseUrl = "/jp";
  req.path = "/v3_0/offshore/info";
  req.method = "POST";
  const proxiedSBackObj = {
    code: 0,
    msg: "添加成功"
  };
  res.locals.proxiedServerBack = proxiedSBackObj;
  //supervisorStatus 接口状态，根据接口状态，返回不同的数据结构
  res.locals.supervisorStatus = proxiedSBackObj["code"];
  proxyPipeline.execute(req, res);
  expect(db.get("apiStack").value()[3]).not.toBe(undefined);
  expect(db.get("apiStack").value()[3].id).toBe(
    db.get("apiStatus").value()[2].stable
  );
});

test("same url & diff method in same project, modify result", () => {
  req.baseUrl = "/jp";
  req.path = "/v3_0/offshore/info";
  req.method = "POST";
  const proxiedSBackObj = {
    code: 0,
    msg: 360
  };
  res.locals.proxiedServerBack = proxiedSBackObj;
  //supervisorStatus 接口状态，根据接口状态，返回不同的数据结构
  res.locals.supervisorStatus = proxiedSBackObj["code"];
  proxyPipeline.execute(req, res);
  expect(db.get("apiStack").value()[4]).not.toBe(undefined);
  expect(db.get("apiStack").value()[4].id).toBe(
    db.get("apiStatus").value()[2].head
  );
});
