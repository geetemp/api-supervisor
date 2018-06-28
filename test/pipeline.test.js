import Pipeline from "../app/pipeline";

test("Pipeline not continue", () => {
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

test("Pipeline continue", () => {
  const pipeline = new Pipeline();
  pipeline.addHandleBackWrap((req, res) => {
    return true;
  });
  pipeline.addHandleBackWrap((req, res) => {
    const { code } = res;
    expect(code).toBe(0);
  });
  pipeline.execute(undefined, { code: 0 });
});
