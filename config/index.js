const development = require("./dev.env");
const production = require("./pro.env");

module.exports = {
  development,
  production
}[process.env.NODE_ENV || "development"];
