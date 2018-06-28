"use strict";

/**
 * Module dependencies.
 */
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * Api Schema
 */
const ApiStackSchema = new Schema({
  id: { type: String, default: "", trim: true },
  apiStatusId: { type: Schema.ObjectId },
  params: Map,
  resultDeclare: [Map],
  result: Map,
  timestamp: { type: Date, default: Date.now }
});

/**
 * Validations
 */
ApiStackSchema.path("id").required(true, "ApiStack id cannot be blank");

/**
 * Pre-remove hook
 */

// ArticleSchema.pre("remove", function(next) {
//   next();
// });

/**
 * Methods
 */

ApiStackSchema.methods = {};

/**
 * Statics
 */
ApiStackSchema.statics = {};

mongoose.model("ApiStack", ApiStackSchema);
