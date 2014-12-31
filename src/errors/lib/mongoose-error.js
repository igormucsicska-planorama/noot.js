/**
 * Dependencies
 */
var NOOT = require('../../../')('error', 'http');
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
  var message;
  var statusCode;
  var name;

  if (err instanceof ValidationError || err instanceof CastError) {
    statusCode = NOOT.HTTP.BadRequest;
    message = err.toString();
    name = 'BadRequestError';
  } else if (err.code === 11000) {
    statusCode = NOOT.HTTP.Conflict;
    message = err.message;
    name = 'ConflictError';
  } else {
    statusCode = NOOT.HTTP.InternalServerError;
    message = err.message;
    name = 'InternalServerError';
  }

  return new (NOOT.Error.extend({ message: message, name: name, statusCode: statusCode }))();
};

/**
 * @exports
 */
module.exports = MongooseError;