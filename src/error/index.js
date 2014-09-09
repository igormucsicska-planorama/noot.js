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
 * @param {Object|...String} options
 * @constructor
 */
var NOOTError = function(options) {
  Error.call(this);

  if (NOOT.isPlainObject(options)) _.extend(this, options);
  else this.message = NOOT.makeArray(arguments).join(' ');

  if (NOOT.isUndefined(this.code)) this.code = this.name;
};


/**
 * Inherit from Error
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
NOOTError.prototype.toJSON = function() {
  var properties = NOOT.makeArray(arguments);
  properties = properties.length ? properties : ['code', 'message'];
  return _.extend({ error: true }, _.pick(this, properties));
};

/**
 *
 *
 * @param [proto]
 * @returns {Object}
 */
NOOTError.extend = function(proto) {
  var self = this;

  var ErrorClass = function() {
    self.apply(this, arguments);
    Error.captureStackTrace(this, ErrorClass);
  };

  var Surrogate = function() { this.constructor = ErrorClass; };
  Surrogate.prototype = this.prototype;

  ErrorClass.prototype = new Surrogate();
  ErrorClass.prototype.constructor = ErrorClass;

  for (var key in proto) {
    ErrorClass.prototype[key] = proto[key];
  }

  _.extend(ErrorClass, this);

  return ErrorClass;
};

/**
 * @module
 */
module.exports = NOOTError.extend();