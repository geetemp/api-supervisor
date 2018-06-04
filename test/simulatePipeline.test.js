import simulatePipeline from "../src/pipeline/simulatePipeline";
import db from "../src/store/dbInit";

let res = {};
let req = {};

beforeAll(() => {
  db.set("apis", []).write();
  db.set("apiStatus", []).write();
  db.set("apiStack", []).write();
  db.set("projects.proxy.status", 0).write();

  res.status = function(httpStatus) {
    return res;
  };
  res.locals = {};
  req.baseUrl = "/gp";
  req.path = "/v3_0/offshore/info";
  req.method = "get";
});

test("no mock data,no apis", () => {
  res.locals.supervisorStatus = 0;
  res.send = function(str) {
    expect(str).toBe("this api isn't proxied");
  };
  simulatePipeline.execute(req, res);
});

test("no mock data,no apiStatus", () => {
  res.locals.supervisorStatus = 0;
  res.send = function(str) {
    expect(str).toBe("this api status isn't proxied");
  };
  db
    .get("apis")
    .push({
      pro: "gp",
      url: "/v3_0/offshore/info",
      desc: "",
      method: "get",
      paramsDeclare: [],
      id: "S1BsWtbgQ"
    })
    .write();
  simulatePipeline.execute(req, res);
});

test("no mock data,no apiStack", () => {
  res.locals.supervisorStatus = 0;
  res.send = function(str) {
    expect(str).toBe("this api stack isn't proxied");
  };
  db
    .get("apiStatus")
    .push({
      status: 0,
      apiId: "S1BsWtbgQ",
      head: "eaf5bdddd8d5fa81a63246975fb3bba8",
      stable: "eaf5bdddd8d5fa81a63246975fb3bba8",
      resultDeclare: [],
      id: "Hkgrj-K-e7"
    })
    .write();
  simulatePipeline.execute(req, res);
});

afterAll(() => {
  db.set("apis", []).write();
  db.set("apiStatus", []).write();
  db.set("apiStack", []).write();
});
