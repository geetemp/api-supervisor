import Mock from "mockjs";

export function isArray(arg) {
  return Object.prototype.toString.call(arg) === "[object Array]";
}

export function isEmptyObj(obj) {
  return !Object.keys(obj).length;
}

/**
 * 获取当前时间戳
 */
export function getTimestamp() {
  return new Date().getTime();
}

/**
 * json转成 JSON Schema
 * @param {*} json
 */
export function toJSONSchema(json) {
  let result = eval("(" + json + ")"); // eslint-disable-line no-eval
  let schema = Mock.toJSONSchema(result);
  let memoryProperties = {};
  if (schema.properties)
    schema.properties.forEach(item => handleJSONSchema(item, memoryProperties));
  return memoryProperties;
}

const handleJSONSchema = (schema, parent) => {
  if (!schema) return;
  // DONE 2.1 需要与 Mock 的 rule.type 规则统一，首字符小写，好烦！应该忽略大小写！
  let type = schema.type[0].toUpperCase() + schema.type.slice(1);
  parent[schema.name] = type;

  if (schema.properties) {
    parent[schema.name] = { "su-type": type };
    return schema.properties.forEach(item =>
      handleJSONSchema(item, parent[schema.name])
    );
  }
  if (schema.items && schema.items[0] && schema.items[0].properties) {
    parent[schema.name] = { "su-type": type };
    return schema.items[0].properties.forEach(item =>
      handleJSONSchema(item, parent[schema.name])
    );
  }
};

/**
 * JSON对象排序
 * @param {*} obj
 */
export function sortObjectKeys(obj) {
  return Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      if (Array.isArray(obj[key])) {
        acc[key] = obj[key].map(sortObjectKeys);
      }
      if (typeof obj[key] === "object") {
        acc[key] = sortObjectKeys(obj[key]);
      } else {
        acc[key] = obj[key];
      }
      return acc;
    }, {});
}

/**
 * 变量值审查
 * @param {*} value 待审查变量值
 * @param {*} expectValues 期待的值
 */
export function checkValue(value, expectValues) {
  if (typeof value !== "object" || (Array.isArray(value) && !value.length)) {
    if (!checkValue.isExpected) checkValue.isExpected = [];
    checkValue.isExpected.push(valueIsExpected(value));
  } else if (Array.isArray(value)) {
    for (const val of value) {
      return checkValue(val, expectValues);
    }
  } else if (typeof value === "object" && value !== null) {
    Object.keys(value).forEach(key => {
      return checkValue(value[key], expectValues);
    });
  }
  for (const is of checkValue.isExpected) {
    if (is) return true;
  }
  return false;

  function valueIsExpected(value) {
    const valueStr = JSON.stringify(value);
    for (let i = 0; i < expectValues.length; i++) {
      if (JSON.stringify(expectValues[i]) === valueStr) {
        return true;
      }
    }
    return false;
  }
}

/**
 * 接口返回格式模板
 * @param {*} code 返回码
 * @param {*} data 返回结果
 */
export function transferTemplate(data = {}, code = 0) {
  return { code, data };
}

/**
 * 过滤掉对象值为undefined的键
 * @param {*} obj 被过滤对象
 */
export function filterUndefined(obj) {
  const keys = Object.keys(obj);
  let filterObj = {};
  for (const key of keys) {
    if (obj[key]) filterObj[key] = obj[key];
  }
  return filterObj;
}

/**
 * 判断是否为Json
 * @param {*} str
 */
export function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

/**
 * 设置请求Path
 * @param {*} path
 * @param {*} req
 */
export function setReqPath(path, req) {
  const pathWordArray = path.split("/");
  req.baseUrl = "/" + (pathWordArray[1] || "");
  let composePath = "";
  for (let i = 2; i < pathWordArray.length; i++) {
    composePath += `/${pathWordArray[i] || ""}`;
  }
  req.rPath = composePath;
}
