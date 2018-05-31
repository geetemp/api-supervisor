import Pipeline from "./index";

import {
  findApi,
  findApiStatus,
  findApiStack,
  logApiStack,
  response
} from "./baseHandles";

const simulatePipeline = new Pipeline();
simulatePipeline.addHandleBackWrap([findApi, findApiStatus, findApiStack]);
simulatePipeline.addHandleBackWrap(logApiStack);
simulatePipeline.addHandleBackWrap(response);

export default simulatePipeline;
