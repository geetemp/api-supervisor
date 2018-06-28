const env = require("./env");

module.exports = Object.assign(env, {
  db: "mongodb://127.0.0.1/api-supervisor"
});
