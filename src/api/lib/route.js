/**
 * Dependencies
 */
var NOOT = require('../../../')('object', 'url', 'http');
var _ = require('lodash');
var moment = require('moment');

var Stack = require('./stack');
var Authable = require('./interfaces/authable');
var Queryable = require('./interfaces/queryable');
var Utils = require('./utils');

/***********************************************************************************************************************
 * @class Route
 * @namespace NOOT.API
 * @extends NOOT.Object
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
    NOOT.defaults(this, Route.DEFAULTS);
    NOOT.required(this, 'path', 'resource');
    this.method = this.method.toLowerCase();
    this.computeQueryable();
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

    if (this.handlers) {
      if (this.handler) throw new Error('Cannot provide both `handler` and `handlers`');
      handlers = NOOT.makeArray(this.handlers);
    } else {
      handlers = [];
      if (this.handler) handlers.push(this.handler);
    }

    var pre = _.compact([
      this._createStack.bind(this),

      this.resource.api.authentication && this.resource.api.authentication.bind(this.resource.api),
      this.resource.authentication && this.resource.authentication.bind(this.resource),
      this.authentication && this.authentication.bind(this),

      this.resource.api.authorization && this.resource.api.authorization.bind(this.resource.api),
      this.resource.authorization && this.resource.authorization.bind(this.resource),
      this.authorization && this.authorization.bind(this),

      this.resource.validateFields && this.resource.validateFields.bind(this.resource),
      this.resource.validateOperators && this.resource.validateOperators.bind(this.resource),
      this.schema && this._validateSchema.bind(this),
      this.validation && this.validation.bind(this)
    ]);

    var post = _.compact([
      this.resource.formatResponsePackage && this.resource.formatResponsePackage.bind(this.resource),
      this.resource.sendResponse && this.resource.sendResponse.bind(this.resource)
    ]);

    handlers = handlers.map(function(handler) { return handler.bind(self); });

    handlers = pre.concat(handlers).concat(post).map(function(handler) {
      if (handler.length > 1) return handler;
      return function(req, res, next) {
        var stack = req.nootApiStack;
        stack.next = next;
        return handler(stack);
      };
    });

    Utils.makeReadOnly(this, 'handlers', handlers);
  },

  /**
   * Safely build route's path for it to include its resource path.
   *
   * @method _buildPath
   * @private
   */
  _buildPath: function() {
    var args = [
      '/',
      this.resource.api.name,
      this.resource.path,
      this.isDetail ? ':id' : '',
      this.path
    ];

    Utils.makeReadOnly(this, 'path', NOOT.Url.join.apply(NOOT.Url, args).replace(/\/$/, ''));
  },

  /**
   *
   *
   *
   * @param req
   * @param res
   * @param next
   * @returns {*}
   */
  _createStack: function(req, res, next) {
    req.nootApiStack = Stack.create({
      req: req,
      res: res,
      route: this,
      startedOn: moment(),
      __queryableParent: this
    });

    return next();
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
  }

}, {

  DEFAULTS: {
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