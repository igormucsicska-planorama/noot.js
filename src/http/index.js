/**
 * Dependencies
 */
var NOOT = require('../../')('namespace');


/***********************************************************************************************************************
 * Complete list of HTTP codes.
 *
 * @class HTTP
 * @static
 * @namespace NOOT
 **********************************************************************************************************************/
var HTTP = NOOT.Namespace.create({
  /**
   * @property Continue
   * @static
   * @final
   * @type {number}
   */
  Continue: 100,
  /**
   * @property SwitchingProtocols
   * @static
   * @final
   * @type {number}
   */
  SwitchingProtocols: 101,

  /**
   * @property OK
   * @static
   * @final
   * @type {number}
   */
  OK: 200,
  /**
   * @property Created
   * @static
   * @final
   * @type {number}
   */
  Created: 201,
  /**
   * @property Accepted
   * @static
   * @final
   * @type {number}
   */
  Accepted: 202,
  /**
   * @property NonAuthoritativeInformation
   * @static
   * @final
   * @type {number}
   */
  NonAuthoritativeInformation: 203,
  /**
   * @property NoContent
   * @static
   * @final
   * @type {number}
   */
  NoContent: 204,
  /**
   * @property ResetContent
   * @static
   * @final
   * @type {number}
   */
  ResetContent: 205,
  /**
   * @property PartialContent
   * @static
   * @final
   * @type {number}
   */
  PartialContent: 206,

  /**
   * @property MultipleChoices
   * @static
   * @final
   * @type {number}
   */
  MultipleChoices: 300,
  /**
   * @property MovedPermanently
   * @static
   * @final
   * @type {number}
   */
  MovedPermanently: 301,
  /**
   * @property MovedTemporarily
   * @static
   * @final
   * @type {number}
   */
  MovedTemporarily: 302,
  /**
   * @property SeeOther
   * @static
   * @final
   * @type {number}
   */
  SeeOther: 303,
  /**
   * @property NotModified
   * @static
   * @final
   * @type {number}
   */
  NotModified: 304,
  /**
   * @property UseProxy
   * @static
   * @final
   * @type {number}
   */
  UseProxy: 305,

  /**
   * @property BadRequest
   * @static
   * @final
   * @type {number}
   */
  BadRequest: 400,
  /**
   * @property Unauthorized
   * @static
   * @final
   * @type {number}
   */
  Unauthorized: 401,
  /**
   * @property PaymentRequired
   * @static
   * @final
   * @type {number}
   */
  PaymentRequired: 402,
  /**
   * @property Forbidden
   * @static
   * @final
   * @type {number}
   */
  Forbidden: 403,
  /**
   * @property NotFound
   * @static
   * @final
   * @type {number}
   */
  NotFound: 404,
  /**
   * @property MethodNotAllowed
   * @static
   * @final
   * @type {number}
   */
  MethodNotAllowed: 405,
  /**
   * @property NotAcceptable
   * @static
   * @final
   * @type {number}
   */
  NotAcceptable: 406,
  /**
   * @property ProxyAuthenticationRequired
   * @static
   * @final
   * @type {number}
   */
  ProxyAuthenticationRequired: 407,
  /**
   * @property RequestTimeOut
   * @static
   * @final
   * @type {number}
   */
  RequestTimeOut: 408,
  /**
   * @property Conflict
   * @static
   * @final
   * @type {number}
   */
  Conflict: 409,
  /**
   * @property Gone
   * @static
   * @final
   * @type {number}
   */
  Gone: 410,
  /**
   * @property LengthRequired
   * @static
   * @final
   * @type {number}
   */
  LengthRequired: 411,
  /**
   * @property PreconditionFailed
   * @static
   * @final
   * @type {number}
   */
  PreconditionFailed: 412,
  /**
   * @property RequestEntityTooLarge
   * @static
   * @final
   * @type {number}
   */
  RequestEntityTooLarge: 413,
  /**
   * @property RequestURITooLong
   * @static
   * @final
   * @type {number}
   */
  RequestURITooLong: 414,
  /**
   * @property UnsupportedMediaType
   * @static
   * @final
   * @type {number}
   */
  UnsupportedMediaType: 415,
  /**
   * @property RequestRangeUnsatisfiable
   * @static
   * @final
   * @type {number}
   */
  RequestRangeUnsatisfiable: 416,
  /**
   * @property ExpectationFailed
   * @static
   * @final
   * @type {number}
   */
  ExpectationFailed: 417,

  /**
   * @property InternalServerError
   * @static
   * @final
   * @type {number}
   */
  InternalServerError: 500,
  /**
   * @property NotImplemented
   * @static
   * @final
   * @type {number}
   */
  NotImplemented: 501,
  /**
   * @property BadGateway
   * @static
   * @final
   * @type {number}
   */
  BadGateway: 502,
  /**
   * @property ServiceUnavailable
   * @static
   * @final
   * @type {number}
   */
  ServiceUnavailable: 503,
  /**
   * @property GatewayTimeOut
   * @static
   * @final
   * @type {number}
   */
  GatewayTimeOut: 504,
  /**
   * @property HTTPVersionNotSupported
   * @static
   * @final
   * @type {number}
   */
  HTTPVersionNotSupported: 505
});

/**
 * @exports
 */
module.exports = HTTP;