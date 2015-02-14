/**
 * Dependencies
 */
var NOOT = require('../../../')('object', 'url', 'http', 'errors');
var _ = require('lodash');
var moment = require('moment');

var Stack = require('./stack');
var Authable = require('./interfaces/authable');
var Queryable = require('./interfaces/queryable');
var Utils = require('./utils');
var FilterModes = require('./filter-modes');

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

      this.setupStack && this.setupStack.bind(this),
      this._parseQueryString.bind(this),

      this.resource.parseQueryFilter && this.resource.parseQueryFilter.bind(this.resource),
      this.resource.parseQuerySelect && this.resource.parseQuerySelect.bind(this.resource),
      this.resource.parseQuerySort && this.resource.parseQuerySort.bind(this.resource),
      this.validateFields && this.validateFields.bind(this),

      this.schema && this._validateSchema.bind(this),
      this.validation && this.validation.bind(this)
    ]);

    var post = _.compact([
      this.resource.formatResponsePackage && this.resource.formatResponsePackage.bind(this.resource),
      this.resource.sendResponse && this.resource.sendResponse.bind(this.resource)
    ]);

    handlers = handlers.map(function(handler) { return handler.bind(self); });

    handlers = pre.concat(handlers).concat(post).map(function(handler) {
      if (handler.length > 2) return handler;
      return function(req, res, next) {
        var stack = req.nootApiStack;
        stack.next = next;
        return handler(stack);
      };
    });

    Utils.makeReadOnly(this, 'handlers', handlers);
  },


  validateFields: function(stack) {
    var query = stack.query;

    var invalid;

    if (query.select) {
      invalid = stack.getInvalidProperties(query.select, FilterModes.SELECT);
      if (invalid.length) {
        invalid.forEach(function(field) {
          stack.pushMessage('You cannot ' + FilterModes.SELECT + ' field ' + field + ' for this resource');
        });
        console.log('IVALID SELECT', invalid, stack.selectable);
        return stack.next(new NOOT.Errors.Forbidden());
      }
    }

    if (query.filter) {
      invalid = stack.getInvalidProperties(Object.keys(query.filter), FilterModes.FILTER);
      if (invalid.length) {
        invalid.forEach(function(field) {
          stack.pushMessage('You cannot ' + FilterModes.FILTER + ' field ' + field + ' for this resource');
        });
        console.log('IVALID FILTER', invalid, stack.filterable);
        return stack.next(new NOOT.Errors.Forbidden());
      }
    }

    if (query.sort) {
      invalid = stack.getInvalidProperties(query.sort, FilterModes.SORT);
      if (invalid.length) {
        invalid.forEach(function(field) {
          stack.pushMessage('You cannot ' + FilterModes.SORT + ' field ' + field + ' for this resource');
        });
        console.log('IVALID SORT', invalid);
        return stack.next(new NOOT.Errors.Forbidden());
      }
    }

    //if (stack.body) {
    //  invalid = stack.getInvalidProperties(stack.body, FilterModes.WRITE);
    //  if (invalid.length) {
    //    invalid.forEach(function(field) {
    //      stack.pushMessage('You cannot ' + FilterModes.WRITE + ' field ' + field + ' for this resource');
    //    });
    //    return stack.next(new NOOT.Errors.Forbidden());
    //  }
    //}

    return stack.next();
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

  _parseQueryString: function(stack) {
    stack.parseQueryString();
    return stack.next();
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