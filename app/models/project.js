"use strict";

/**
 * Module dependencies.
 */
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * Api Schema
 */
const ProjectSchema = new Schema({
  name: { type: String, default: "", trim: true },
  identity: { type: String, default: "", trim: true, index: true },
  proxy: {
    target: { type: String, default: "", trim: true },
    status: { type: Number, default: 1, trim: true }
  }
});

/**
 * Validations
 */
ProjectSchema.path("identity").required(
  true,
  "project identity cannot be blank"
);
ProjectSchema.path("proxy.target").required(
  true,
  "project proxy.target cannot be blank"
);

/**
 * Pre-remove hook
 */

// ArticleSchema.pre("remove", function(next) {
//   next();
// });

/**
 * Methods
 */

ProjectSchema.methods = {};

/**
 * Statics
 */

ProjectSchema.statics = {};

mongoose.model("Project", ProjectSchema);
