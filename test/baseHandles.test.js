import {
  findApi,
  findApiStatus,
  findApiStack,
  response
} from "../src/pipeline/baseHandles";

test("findApi test", () => {
  const pipeline = new Pipeline();
  pipeline.addHandleBackWrap((req, res) => {
    return false;
  });
  pipeline.addHandleBackWrap((req, res) => {
    const { code } = res;
    expect(code).toBe(undefined);
  });
  pipeline.execute(undefined, { code: 0 });
});
