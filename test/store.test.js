import apiStore from "../app/store/api";

test("apiStore getOne", () => {
  const api = apiStore.getOne("gp", "/v3_0/offshore/info");
  expect(api.url).toBe("/v3_0/offshore/info");
});
