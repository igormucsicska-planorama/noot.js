/**
 * Dependencies
 */
var NOOT = require('../../')('namespace', 'error');


/***********************************************************************************************************************
 * NOOT.Errors
 ***********************************************************************************************************************
 *
 *
 *
 *
 **********************************************************************************************************************/
var Errors = NOOT.Namespace.create({

  /**
   * 50? errors
   */
  InternalServer: NOOT.Error.extend({ name: 'InternalServerError', statusCode: 500 }),
  NotImplemented: NOOT.Error.extend({ name: 'NotImplementedError', statusCode: 501 }),

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
 * @module
 */
module.exports = Errors;