/**
 * Dependencies
 */
var NOOT = require('../../../')('error');
var mongoose = require('mongoose');

var ValidationError = mongoose.Error.ValidationError;
var CastError = mongoose.Error.CastError;

/**
 * Simple wrapper to attach correct statusCode for Mongoose errors.
 *
 * @property MongooseError
 * @for NOOT.Errors
 * @type Class
 * @static
 */
var MongooseError = function(err) {
  if (err instanceof ValidationError || err instanceof CastError) {
    this.statusCode = NOOT.HTTP.BadRequest;
  }

  NOOT.Error.call(this);
};

MongooseError.prototype = NOOT.Error.prototype;

/**
 * @exports
 */
module.exports = MongooseError;