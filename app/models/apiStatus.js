"use strict";

/**
 * Module dependencies.
 */
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * Api Schema
 */
const ApiStatusSchema = new Schema({
  status: { type: Number, default: 0 },
  apiId: { type: Schema.ObjectId },
  head: String,
  stable: String,
  id: { type: Schema.ObjectId }
});

/**
 * Validations
 */

/**
 * Pre-remove hook
 */

// ArticleSchema.pre("remove", function(next) {
//   next();
// });

/**
 * Methods
 */

ApiStatusSchema.methods = {};

/**
 * Statics
 */

ApiStatusSchema.statics = {};

mongoose.model("ApiStatus", ApiStatusSchema);
