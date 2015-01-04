/**
 * Dependencies
 */
var NOOT = require('../../../')('object', 'url', 'time', 'errors', 'http');
var Inflector = require('inflected');
var _ = require('lodash');

var DefaultRoutes = require('./default-routes');
var Queryable = require('./queryable');
var Authable = require('./authable');


/***********************************************************************************************************************
 * @class Resource
 * @namespace NOOT.API
 * @constructor
 * @extends NOOT.Object
 * @uses NOOT.API.Queryable
 * @uses NOOT.API.Authable
 **********************************************************************************************************************/
var Resource = NOOT.Object.extend(Authable).extend(Queryable).extend({
  model: null,
  path: '',
  countCacheExpiration: undefined,
  defaultResponseStatusCode: undefined,
  allowedResponseFields: undefined,
  areFindsLean: false,
  defaultResponseType: undefined,
  allowedResponseTypes: undefined,

  customRoutes: null,

  methods: undefined,
  listMethods: undefined,

  _routes: undefined,

  /**
   * Constructor
   */
  init: function() {
    NOOT.required(this, 'model');
    if (!(this.api instanceof require('../index'))) throw new Error('Not a NOOT.API');
    _.defaults(this, Resource._DEFAULTS);
    Resource.validateMethods(this.methods);
    Resource.validateMethods(this.listMethods);
    this._buildPath();
    this._computeQueryable();
    this._buildRoutes();
  },

  _buildRoutes: function() {
    var self = this;
    var routes = (NOOT.makeArray(this.customRoutes) || []).concat(this.methods.map(function(methodName) {
      return DefaultRoutes[Inflector.classify(methodName)].extend({
        allowMany: !!~self.listMethods.indexOf(methodName)
      });
    }));

    this._routes = routes.map(function(route) {
      return route.create({ resource: self, _queryableParent: self });
    });

  },

  _buildPath: function() {
    var path = this.path || NOOT.dasherize(Inflector.pluralize(this.model.modelName));
    this.path = NOOT.Url.join('/', this.api.name || '', path).replace(/\/$/, '');
  },

  /**
   *
   *
   * @method createResponse
   * @param {NOOT.API.Stack} stack
   */
  createResponse: function(stack) {
    stack.res.status(stack.package.statusCode || this.defaultResponseStatusCode);
    stack.package = _.pick(stack.package, ['data', 'error', 'message', 'messages', 'meta']);
    return this.getResponseHandler(stack)(stack);
  },


  getResponseHandler: function(stack) {
    var type = stack.req.accepts(this.allowedResponseTypes) || this.defaultResponseType;
    var handler;
    switch (type) {
      case 'json': handler = this.sendJSON; break;
      default: handler = this.sendJSON;
    }
    return handler.bind(this);
  },

  sendJSON: function(stack) {
    return stack.res.json(stack.package);
  }

}, {

  /**
   * @attribute _DEFAULT
   * @static
   * @private
   * @readOnly
   * @type Object
   */
  _DEFAULTS: {
    get methods() { return ['get', 'put', 'patch', 'delete', 'post']; },
    get listMethods() { return ['get', 'put', 'patch', 'delete', 'post']; },
    get maxLimit() { return 1000; },
    get defaultLimit() { return 20; },
    get countCacheExpiration() { return NOOT.Time.SECOND; },
    get defaultResponseStatusCode() { return NOOT.HTTP.OK; },
    get allowedResponseFields() { return ['data', 'message', 'error', 'meta', 'code']; },
    get defaultResponseType() { return 'json'; },
    get allowedResponseTypes() { return ['json']; }
  },

  /**
   * Module's supported methods
   */
  _SUPPORTED_METHODS: ['get', 'put', 'patch', 'delete', 'post'],

  /**
   * Ensure array only contains supported methods
   *
   * @param {Array} methods
   */
  validateMethods: function(methods) {
    if (!NOOT.isArray(methods)) throw new Error('`methods` should be an array of HTTP verbs');
    var supported = this._SUPPORTED_METHODS;
    return methods.forEach(function(method) {
      if (!~supported.indexOf(method)) throw new Error('Method "' + method + '" is not supported');
    });
  }
});

/**
 * @exports
 */
module.exports = Resource;