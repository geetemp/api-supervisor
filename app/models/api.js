"use strict";

/**
 * Module dependencies.
 */
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * Api Schema
 */
const ApiSchema = new Schema({
  pro: { type: String, default: "", trim: true },
  url: { type: String, default: "", trim: true },
  desc: { type: String, default: "", trim: true },
  method: { type: String, default: "", trim: true },
  paramsDeclare: [Map],
  id: { type: Schema.ObjectId }
});

/**
 * Validations
 */
ApiSchema.path("pro").required(true, "Api pro cannot be blank");
ApiSchema.path("url").required(true, "Api url cannot be blank");
ApiSchema.path("method").required(true, "Api method cannot be blank");

/**
 * index
 */
ApiSchema.index({ pro: 1, url: 1, method: 1 });

/**
 * Pre-remove hook
 */

// ArticleSchema.pre("remove", function(next) {
//   next();
// });

/**
 * Methods
 */

ApiSchema.methods = {};

/**
 * Statics
 */

ApiSchema.statics = {};

mongoose.model("Api", ApiSchema);
