import Mock from "mockjs";
import _ from "lodash";

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
    parent[schema.name] = { type };
    return schema.properties.forEach(item =>
      handleJSONSchema(item, parent[schema.name])
    );
  }
  if (schema.items && schema.items[0] && schema.items[0].properties) {
    parent[schema.name] = { type };
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
 * 接口返回格式模板
 * @param {*} code 返回码
 * @param {*} data 返回结果
 */
export function transferTemplate(data = {}, code = 0) {
  return { code, data };
}
