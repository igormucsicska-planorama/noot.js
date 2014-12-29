/**
 * Dependencies
 */
var NOOT = require('../../')('namespace', 'error');

/***********************************************************************************************************************
 * @class Errors
 * @static
 * @namespace NOOT
 **********************************************************************************************************************/
var Errors = NOOT.Namespace.create({

  /**
   * 50? errors
   */
  InternalServerError: NOOT.Error.extend({ name: 'InternalServerError', statusCode: 500 }),
  NotImplemented: NOOT.Error.extend({ name: 'NotImplementedError', statusCode: 501 }),
  Unavailable: NOOT.Error.extend({ name: 'UnavailableError', statusCode: 503 }),

  /**
   * 40? errors
   */
  BadRequest: NOOT.Error.extend({ name: 'BadRequestError', statusCode: 400 }),
  Unauthorized: NOOT.Error.extend({ name: 'UnauthorizedError', statusCode: 401 }),
  Forbidden: NOOT.Error.extend({ name: 'ForbiddenError', statusCode: 403 }),
  NotFound: NOOT.Error.extend({ name: 'NotFoundError', statusCode: 404 }),
  Conflict: NOOT.Error.extend({ name: 'ConflictError', statusCode: 409 })

});


/**
 * @exports
 */
module.exports = Errors;