import Pipeline from "./index";

import { findApi, findApiStatus, findApiStack, response } from "./baseHandles";

const simulatePipeline = new Pipeline("simulate");
simulatePipeline.addHandleBackWrap([findApi, findApiStatus, findApiStack]);
simulatePipeline.addHandleBackWrap(response);

export default simulatePipeline;
