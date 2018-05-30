var jsondiffpatch = require("jsondiffpatch");

test("jsondiffpatch try test", () => {
  var left = { a: 3, b: 4 };
  var right = { a: 5, c: 9 };
  var delta = jsondiffpatch.diff(left, right);
  console.log(delta);
});
