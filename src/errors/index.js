/**
 * Dependencies
 */
var NOOT = require('../../')('namespace', 'error', 'http');
var _ = require('lodash');

var mongoose;
var ValidationError;
var CastError;


var defineMongoose = function() {
  if (!mongoose) {
    mongoose = require('mongoose');
    ValidationError = mongoose.Error.ValidationError;
    CastError = mongoose.Error.CastError;
  }
};

/***********************************************************************************************************************
 * @class Errors
 * @static
 * @namespace NOOT
 **********************************************************************************************************************/
var Errors = NOOT.Namespace.create({

  /**
   * @property InternalServerError
   * @static
   * @type Class
   */
  InternalServerError: NOOT.Error.extend({ name: 'InternalServerError', statusCode: NOOT.HTTP.InternalServerError }),

  /**
   * @property NotImplemented
   * @static
   * @type Class
   */
  NotImplemented: NOOT.Error.extend({ name: 'NotImplementedError', statusCode: NOOT.HTTP.NotImplemented }),

  /**
   * @property Unavailable
   * @static
   * @type Class
   */
  Unavailable: NOOT.Error.extend({ name: 'UnavailableError', statusCode: NOOT.HTTP.ServiceUnavailable }),

  /**
   * @property BadRequest
   * @static
   * @type Class
   */
  BadRequest: NOOT.Error.extend({ name: 'BadRequestError', statusCode: NOOT.HTTP.BadRequest }),

  /**
   * @property Unauthorized
   * @static
   * @type Class
   */
  Unauthorized: NOOT.Error.extend({ name: 'UnauthorizedError', statusCode: NOOT.HTTP.Unauthorized }),

  /**
   * @property Forbidden
   * @static
   * @type Class
   */
  Forbidden: NOOT.Error.extend({ name: 'ForbiddenError', statusCode: NOOT.HTTP.Forbidden }),

  /**
   * @property NotFound
   * @static
   * @type Class
   */
  NotFound: NOOT.Error.extend({ name: 'NotFoundError', statusCode: NOOT.HTTP.NotFound }),

  /**
   * @property Conflict
   * @static
   * @type Class
   */
  Conflict: NOOT.Error.extend({ name: 'ConflictError', statusCode: NOOT.HTTP.Conflict }),


  fromMongooseError: function(err) {
    defineMongoose();
    if (err instanceof ValidationError || err instanceof CastError) return new this.BadRequest(err.toString());
    else if (err.code === 11000) return new this.Conflict(err.message);
    return new this.InternalServerError(err.message);
  },

  /**
   * Given a status code, returns an instance of one the defined NOOT.Errors. If no defined NOOT.Errors is found, then
   * NOOT.Errors.InternalServerError will be used as a default.
   *
   * @method fromStatusCode
   * @param {Number} statusCode
   * @param {*...} [errorParams] NOOT.Error parameters
   */
  fromStatusCode: function() {
    var args = NOOT.makeArray(arguments);
    var statusCode = args.shift();
    var ErrorClass = _.find(this, function(item) { return item.prototype.statusCode === statusCode; }) ||
      this.InternalServerError;

    return (function() {
      function Wrapper() { return ErrorClass.apply(this, args); }
      Wrapper.prototype = ErrorClass.prototype;
      return new Wrapper();
    })();
  }

});


/**
 * @exports
 */
module.exports = Errors;