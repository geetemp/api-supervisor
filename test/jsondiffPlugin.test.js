var jsondiffpatch = require("jsondiffpatch");

test("jsondiffpatch plugin test", () => {
  var diffpatcher = jsondiffpatch.create();
  var NUMERIC_DIFFERENCE = -8;

  var numericDiffFilter = function(context) {
    if (typeof context.left === "number" && typeof context.right === "number") {
      context
        .setResult([0, context.right - context.left, NUMERIC_DIFFERENCE])
        .exit();
    }
  };
  // a filterName is useful if I want to allow other filters to be inserted before/after this one
  numericDiffFilter.filterName = "numeric";

  // to decide where to insert your filter you can look at the pipe's filter list
  expect(diffpatcher.processor.pipes.diff.list()).toEqual([
    "collectChildren",
    "trivial",
    "dates",
    "texts",
    "objects",
    "arrays"
  ]);

  // insert my new filter, right before trivial one
  diffpatcher.processor.pipes.diff.before("trivial", numericDiffFilter);

  // for debugging, log each filter
  diffpatcher.processor.pipes.diff.debug = true;

  // try it
  var delta = diffpatcher.diff(
    { population: { a: 400 } },
    { population: { a: 403 } }
  );
  expect(delta).toEqual({ population: { a: [0, 3, -8] } });
});
