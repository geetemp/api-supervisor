import * as jsondiffpatch from "jsondiffpatch";
const diffpatcher = jsondiffpatch.create({});

const EmptyArrayDiffFilter = function(context) {
  if (context.left === "Array") {
    context.setResult([context.left, context.right]).exit();
  }
};
// a filterName is useful if I want to allow other filters to be inserted before/after this one
EmptyArrayDiffFilter.filterName = "emptyArray";

// insert my new filter, right before trivial one
diffpatcher.processor.pipes.diff.before("trivial", EmptyArrayDiffFilter);

export default jsondiffpatch;
export { diffpatcher };
