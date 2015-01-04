/**
 * Dependencies
 */
var NOOT = require('../../../')('object', 'url');
var _ = require('lodash');
var Stack = require('./stack');
var Queryable = require('./queryable');
var Authable = require('./authable');

/***********************************************************************************************************************
 * @class Route
 * @namespace NOOT.API
 * @extends NOOT.Object
 * @uses NOOT.API.Queryable
 * @uses NOOT.API.Authable
 * @constructor
 **********************************************************************************************************************/
var Route = NOOT.Object.extend(Authable).extend(Queryable).extend({

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
   * Define if route concerns only one item, in which case an `:id` parameter will be added to the route's path
   *
   * @property isDetail
   * @type Boolean
   * @default false
   */
  isDetail: false,

  /**
   * Constructor
   */
  init: function() {
    NOOT.required(this, 'path', 'resource');
    _.defaults(this, Route._DEFAULTS);
    this.method = this.method.toLowerCase();
    this._buildPath();
    this._computeQueryable();
    this._buildHandlers();
  },

  /**
   *
   *
   * @method createResponse
   * @param {NOOT.API.Stack} stack
   */
  createResponse: function(stack) {
    return this.resource.createResponse(stack);
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

    if (this.authorization) this.handlers.unshift(this.authorization);

    if (this.authentication) this.handlers.unshift(this.authentication);

    handlers.unshift(this.validate);

    if (this.schema) handlers.unshift(this._validateSchema);

    handlers.unshift(this.createStack);

    handlers.push(this.createResponse);

    this._handlers = handlers.map(function(handler) {
      if (handler.length > 1) return handler.bind(self);
      return function(req, res, next) {
        var stack = req.nootApiStack;
        stack.next = next;
        return handler.call(self, stack);
      };
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
    this.path = NOOT.Url.join('/', resourcePath, this.isDetail ? ':id' : '', path).replace(/\/$/, '');
  },

  /**
   * Validate body against JSON schema.
   *
   * @method _validateSchema
   * @async
   * @private
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  _validateSchema: function(req, res, next) {
    return Route.validateSchema(req.body, this.schema, function(err) {
      if (err) return next(new NOOT.Errors.BadRequest(err));
      return next();
    });

  },

  createStack: function(req, res, next) {
    req.nootApiStack = Stack.create({ req: req, res: res, _queryableParent: this, route: this });
    return next();
  },

  validate: function(stack) {
    return stack.next();
  },

  get model() { return this.resource.model; }
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