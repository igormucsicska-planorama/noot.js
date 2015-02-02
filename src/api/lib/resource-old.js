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


  /**
   *
   *
   * @property model
   * @type Mongoose.Model
   */
  model: null,

  /**
   *
   *
   * @property path
   * @type String
   */
  path: '',

  /**
   *
   *
   * @property defaultResponseStatusCode
   * @type Number
   */
  defaultResponseStatusCode: null,

  /**
   *
   *
   * @property defaultResponseType
   * @type String
   */
  defaultResponseType: null,

  /**
   *
   *
   * @property allowedResponseTypes
   * @type Array
   */
  allowedResponseTypes: null,

  /**
   *
   *
   * @property allowedResponseTypes
   * @type Array
   */
  allowedOperators: null,

  /**
   *
   *
   * @property customRoutes
   * @type Array
   */
  customRoutes: null,

  /**
   *
   *
   * @property methods
   * @type Array
   */
  methods: null,

  /**
   *
   *
   * @property listMethods
   * @type Array
   */
  listMethods: null,

  /**
   *
   *
   * @property _routes
   * @type Array
   * @private
   */
  _routes: null,


  /**
   * Constructor
   */
  init: function() {
    NOOT.required(this, 'model');
    if (!(this.api instanceof require('./api'))) throw new Error('Not a NOOT.API');

    this.listMethods = this.listMethods || Resource._DEFAULTS.listMethods;
    this.methods = this.methods || Resource._DEFAULTS.methods;
    this.defaultResponseStatusCode = this.defaultResponseStatusCode || Resource._DEFAULTS.defaultResponseStatusCode;
    this.allowedResponseFields = this.allowedResponseFields || Resource._DEFAULTS.allowedResponseFields;
    this.defaultResponseType = this.defaultResponseType || Resource._DEFAULTS.defaultResponseType;
    this.allowedResponseTypes = this.allowedResponseTypes || Resource._DEFAULTS.allowedResponseTypes;
    this.allowedOperators = this.allowedOperators || Resource._DEFAULTS.allowedOperators;

    Resource.validateMethods(this.methods);
    Resource.validateMethods(this.listMethods);
    this._buildPath();
    this._computeQueryable();
    this._buildRoutes();
  },

  /**
   *
   *
   * @method createResponse
   * @param {NOOT.API.Stack} stack
   */
  createResponse: function(stack) {
    stack.res.status(stack.package.statusCode || this.defaultResponseStatusCode);
    stack.package = _.pick(stack.package, ['data', 'error', 'message', 'messages', 'meta', 'code']);
    return this.getResponseHandler(stack)(stack);
  },

  /**
   *
   *
   *
   * @method getResponseHandler
   * @param stack
   * @returns {*}
   */
  getResponseHandler: function(stack) {
    var type = stack.req.accepts(this.allowedResponseTypes) || this.defaultResponseType;
    var handler;
    switch (type) {
      case 'json': handler = this.sendJSON; break;
      default: handler = this.sendJSON;
    }
    return handler.bind(this);
  },

  /**
   *
   *
   *
   * @method sendJSON
   * @param stack
   * @returns {*}
   */
  sendJSON: function(stack) {
    return stack.res.json(stack.package);
  },

  /**
   *
   *
   * @method _buildRoutes
   * @private
   */
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

  /**
   *
   *
   * @method _buildPath
   * @private
   */
  _buildPath: function() {
    var path = this.path || NOOT.dasherize(Inflector.pluralize(this.model.modelName));
    this.path = NOOT.Url.join('/', this.api.name || '', path).replace(/\/$/, '');
  }

}, {

  /**
   * @property _DEFAULT
   * @static
   * @private
   * @readOnly
   * @type Object
   */
  _DEFAULTS: {
    get methods() { return ['get', 'put', 'patch', 'delete', 'post']; },
    get listMethods() { return ['get', 'put', 'patch', 'delete', 'post']; },
    get defaultResponseStatusCode() { return NOOT.HTTP.OK; },
    get allowedResponseFields() { return ['data', 'message', 'error', 'meta', 'code']; },
    get defaultResponseType() { return 'json'; },
    get allowedResponseTypes() { return ['json']; },
    get allowedOperators() { return ['$eq', '$gt', '$gte', '$lt', '$lte', '$in', '$nin', '$ne']; }
  },

  /**
   * @property _SUPPORTED_METHODS
   * @static
   * @private
   * @readOnly
   * @type Array
   */
  _SUPPORTED_METHODS: ['get', 'put', 'patch', 'delete', 'post'],

  /**
   * Ensure array only contains supported methods, throws an error if any is not supported
   *
   * @static
   * @method validateMethods
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