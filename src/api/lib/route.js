/**
 * Dependencies
 */
var NOOT = require('../../../')('object', 'url');
var _ = require('lodash');

/***********************************************************************************************************************
 * @class Route
 * @namespace NOOT.API
 * @extends NOOT.Object
 * @constructor
 **********************************************************************************************************************/
var Route = NOOT.Object.extend({

  /**
   * @property method
   * @type String
   * @default get
   */
  method: 'get',

  /**
   * @property path
   * @type String
   */
  path: '',

  /**
   * @property resource
   * @type NOOT.API.Resource
   */
  resource: null,

  /**
   * @property schema
   * @type Object
   */
  schema: null,

  /**
   * @property handlers
   * @type Array of middlewares
   * @default []
   */
  handlers: null,

  /**
   * Final array of middlewares for this route
   *
   * @property _handlers
   * @type Array of middlewares
   * @private
   * @default []
   */
  _handlers: null,

  /**
   * @property handler
   * @type middleware
   */
  handler: null,

  /**
   * Constructor
   */
  init: function() {
    NOOT.required(this, 'path', 'resource');
    _.defaults(this, Route._DEFAULTS);
    this.method = this.method.toLowerCase();
    this._buildPath();
    this._buildHandlers();
  },

  /**
   * Define routes's handlers array.
   *
   * @method _buildHandlers
   * @return {Array}
   * @private
   */
  _buildHandlers: function() {
    var self = this;
    var handlers;

    // TODO handle authentication and authorization

    if (this.handlers) {
      if (this.handler) throw new Error('Cannot provide both `handler` and `handlers`');
      handlers = NOOT.makeArray(this.handlers);
    } else {
      handlers = [];
      if (this.handler) handlers.push(this.handler);
    }

    if (this.schema) handlers.unshift(this.validateSchema);

    this._handlers = handlers.map(function(handler) {
      return handler.bind(self);
    });

    return this._handlers;
  },

  /**
   * Safely build route's path for it to include its resource path.
   *
   * @method _buildPath
   * @private
   */
  _buildPath: function() {
    var resourcePath = this.resource.path;
    var path = this.path.replace(new RegExp('^' + NOOT.escapeForRegExp(resourcePath)), '');
    this.path = NOOT.Url.join('/', resourcePath, path).replace(/\/$/, '');
  },

  /**
   * Validate body against JSON schema.
   *
   * @method validateSchema
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  validateSchema: function(req, res, next) {
    return Route.validateSchema(req.body, this.schema, function(err) {
      if (err) return next(new NOOT.Errors.BadRequest(err));
      return next();
    });
  }
}, {

  _DEFAULTS: {
    method: 'get'
  },

  validateSchema: function(obj, schema, callback) {
    return callback();
  }
});

/**
 * @exports
 */
module.exports = Route;