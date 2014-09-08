/**
 * Dependencies
 */
var _ = require('lodash');
var NOOT = require('../../')();


/***********************************************************************************************************************
 * NOOT.Error
 ***********************************************************************************************************************
 *
 * @info Custom Error class
 *
 **********************************************************************************************************************/

/**
 * Constructor
 *
 * @param {Object} options
 * @constructor
 */
var NOOTError = function(options) {
  Error.call(this);
  ['name', 'statusCode', 'message', 'code', 'loggingLevel'].forEach(function(property) {
    this[property] = NOOT.isUndefined(options[property]) ? NOOTError.prototype[property] : options[property];
  }.bind(this));

  if (NOOT.isUndefined(this.code)) this.code = this.name;
};

/**
 * Inheritance
 */
NOOTError.prototype = Error.prototype;
NOOTError.prototype.constructor = NOOTError;

/**
 * Default values
 */
NOOTError.prototype.statusCode = 500;
NOOTError.prototype.loggingLevel = 'error';

/**
 * toJSON
 *
 * @returns {Object} Valid JSON representation
 */
NOOTError.prototype.toJSON = function(properties) {
  properties = properties || ['code', 'message'];
  return _.extend({ error: true }, _.pick(this, properties));
};

/**
 * Define logging level for this error class
 *
 * @param level
 */
NOOTError.setLoggingLevel = function(level) {
  this.prototype.loggingLevel = level;
};

/**
 * Define status code for this error class
 *
 * @param statusCode
 */
NOOTError.setStatusCode = function(statusCode) {
  this.prototype.statusCode = statusCode;
};

/**
 * Convenient static method to create new classes that inherits from RESTError
 *
 * @param {Object} [options]
 * @returns {NOOTError}
 */
NOOTError.extend = function(options) {
  var ErrorClass = function(arg) {
    NOOTError.call(this, _.extend(options || {}, { message: NOOT.isError(arg) ? arg.message : arg }));
    Error.captureStackTrace(this, ErrorClass);
  };

  ErrorClass.prototype = NOOTError.prototype;
  ErrorClass.prototype.constructor = ErrorClass;

  return ErrorClass;
};

/**
 * @module
 */
module.exports = NOOTError.extend();