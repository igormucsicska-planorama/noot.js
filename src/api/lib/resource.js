/**
 * Dependencies
 */
var _ = require('lodash');
var NOOT = require('../../../')('object', 'http');

var QueryField = require('./query-field');
var Authable = require('./interfaces/authable');
var Queryable = require('./interfaces/queryable');
var DefaultRoutes = require('./default-routes');
var Route = require('./route');
var Utils = require('./utils');

/***********************************************************************************************************************
 *
 *
 *
 *
 **********************************************************************************************************************/
var Resource = NOOT.Object.extend(Authable).extend(Queryable).extend({

  methods: null,
  detailMethods: null,
  manyMethods: null,
  defaultStatusCode: null,
  supportedOperators: null,
  allowedResponseTypes: null,
  defaultResponseType: null,

  fields: null,

  /**
   *
   *
   *
   */
  init: function() {
    NOOT.defaults(this, Resource.DEFAULTS);
    NOOT.required(this, 'api');
    if (!(this.api instanceof require('./api'))) throw new Error('Not a NOOT.API');
    this.fields = this.fields || this.getFields() || {};
    this.computeQueryable();
    this._buildMethods();
    this._buildRoutes();
  },

  /**
   *
   *
   *
   */
  getFields: function() {},

  /**
   *
   *
   *
   * @private
   */
  _buildMethods: function() {
    var detail = this.detailMethods;
    var many = this.manyMethods;
    var all = this.methods;

    if (detail) {
      detail.forEach(Resource.validateDefaultRouteMethod.bind(Resource));
      detail = detail.map(function(method) { return method.toLowerCase(); });
    }

    if (many) {
      many.forEach(Resource.validateDefaultRouteMethod.bind(Resource));
      many = many.map(function(method) { return method.toLowerCase(); });
    }

    if (all) {
      all.forEach(Resource.validateDefaultRouteMethod.bind(Resource));
      all = all.map(function(method) { return method.toLowerCase(); });
    } else {
      all = Resource.DEFAULT_ROUTES_METHODS;
    }

    // Assign final values and make them readOnly
    Utils.makeReadOnly(this, 'detailMethods', detail || all);
    Utils.makeReadOnly(this, 'manyMethods', many || all);
    Utils.makeReadOnly(this, 'methods', all);
  },

  /**
   *
   *
   *
   * @private
   */
  _buildRoutes: function() {
    var self = this;
    var routes = this.routes || [];

    this.detailMethods.forEach(function(method) {
      routes.push(DefaultRoutes[method].extend({ isDetail: true }));
    });

    this.manyMethods.forEach(function(method) {
      routes.push(DefaultRoutes[method].extend({ isDetail: false }));
    });

    this.routes = routes.map(function(routeClass) {
      if (!Route.detect(routeClass)) throw new Error('Not an NOOT.API.Route');
      return routeClass.create({ resource: self, __queryableParent: self });
    });
  },

  /**
   *
   *
   *
   *
   * @param stack
   * @returns {*}
   */
  validateFields: function(stack) {
    return stack.next();
  },

  /**
   *
   *
   *
   *
   * @param stack
   * @returns {*}
   */
  validateOperators: function(stack) {
    return stack.next();
  },

  /**
   *
   *
   *
   * @param stack
   * @returns {*}
   */
  formatResponsePackage: function(stack) {
    var pack = stack.package;
    if (!pack.messages.length) delete pack.messages;
    pack.statusCode = pack.statusCode || this.defaultStatusCode;
    stack.package = _.pick(pack, ['data', 'error', 'message', 'messages', 'meta']);
    return stack.next();
  },

  /**
   *
   *
   *
   * @param stack
   * @returns {*}
   */
  sendResponse: function(stack) {
    stack.res.status(stack.statusCode);

    var type = stack.req.accepts(this.allowedResponseTypes) || this.defaultResponseType;

    switch (type) {
      case 'json': return this.sendJSON(stack);
      default: return this.sendJSON(stack);
    }
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
  }
}, {

  /**
   *
   */
  DEFAULTS: {
    get methods() { return DefaultRoutes.supportedMethods; },
    get defaultStatusCode() { return NOOT.HTTP.OK; },
    get allowedResponseTypes() { return ['json']; },
    get defaultResponseType() { return 'json'; },
    get supportedOperators() { return this.SUPPORTED_OPERATORS; }
  },


  SUPPORTED_OPERATORS: ['gt', 'gte', 'lt', 'lte', 'eq', 'ne', 'in', 'nin', 'regex'],

  parseFilter: function(filter) {
    var fields = [];
    for (var key in filter) {
      fields.push(QueryField.create({ entry: _.pick(filter, [key]), separator: this.OPERATOR_SEPARATOR }));
    }
    return fields;
  },

  OPERATOR_SEPARATOR: '__',

  /**
   *
   *
   *
   * @param method
   */
  validateDefaultRouteMethod: function(method) {
    if (!_.contains(DefaultRoutes.supportedMethods, method.toLowerCase())) {
      throw new Error('Invalid method for auto generated route: ' + method);
    }
  }

});



module.exports = Resource;