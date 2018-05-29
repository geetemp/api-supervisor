import apiStore from "../src/store/api";

test("apiStore getOne", () => {
  const api = apiStore.getOne("gp", "/v3_0/offshore/info");
  expect(api).toEqual({
    id: "1",
    pro: "gp",
    url: "/v3_0/offshore/info",
    desc: "获取离岸外包",
    method: "get",
    paramsDeclare: [],
    resultDeclare: [],
    head: "se323421"
  });
});
