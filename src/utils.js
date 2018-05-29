import Mock from "mockjs";
import _ from "lodash";

export function isArray(arg) {
  return Object.prototype.toString.call(arg) === "[object Array]";
}

/**
 * json转成 JSON Schema
 * @param {*} json
 */
export function toJSONSchema(json) {
  let result = eval("(" + json + ")"); // eslint-disable-line no-eval
  let schema = Mock.toJSONSchema(result);
  let memoryProperties = [];
  if (schema.properties)
    schema.properties.forEach(item =>
      handleJSONSchema(item, undefined, memoryProperties)
    );
  return memoryProperties;
}

const handleJSONSchema = (schema, parent = { id: -1 }, memoryProperties) => {
  if (!schema) return;
  // DONE 2.1 需要与 Mock 的 rule.type 规则统一，首字符小写，好烦！应该忽略大小写！
  let type = schema.type[0].toUpperCase() + schema.type.slice(1);
  let property = Object.assign(
    {
      name: schema.name,
      type,
      value: /Array|Object/.test(type) ? "" : schema.template
    },
    {
      parentId: parent.id
    },
    {
      id: _.uniqueId("memory-")
    }
  );
  memoryProperties.push(property);

  if (schema.properties) {
    schema.properties.forEach(item =>
      handleJSONSchema(item, property, memoryProperties)
    );
  }
  if (schema.items && schema.items[0] && schema.items[0].properties) {
    schema.items[0].properties.forEach(item =>
      handleJSONSchema(item, property, memoryProperties)
    );
  }
};
