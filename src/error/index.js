/**
 * Dependencies
 */
var _ = require('lodash');
var NOOT = require('../../')();

/***********************************************************************************************************************
 *
 *
 *
 * @class Error
 * @constructor
 * @namespace NOOT
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
NOOTError.prototype = Object.create(Error.prototype);
_.extend(NOOTError.prototype, {
  constructor: NOOTError,
  /**
   * Default values
   */
  statusCode : 500,
  loggingLevel : 'error',
  isNOOTError : true
});


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
 * @param {Object} [proto]
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
 * @exports
 */
module.exports = NOOTError.extend();