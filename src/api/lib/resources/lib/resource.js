/**
 * Dependencies
 */
var _ = require('lodash');
var NOOT = require('../../../../../index')('object', 'http', 'errors');

var Operators = require('./../../operators/index');
var Authable = require('./../../interfaces/authable');
var Queryable = require('./../../interfaces/queryable');
var DefaultRoutes = require('./../../default-routes/index');
var Route = require('./../../route');
var Utils = require('./../../utils');

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
  get fieldsPaths() { return NOOT.isObject(this.fields) ? Object.keys(this.fields) : []; },

  /**
   *
   *
   *
   */
  init: function() {
    NOOT.defaults(this, Resource.DEFAULTS);
    NOOT.required(this, 'api');
    if (!(this.api instanceof require('./../../api'))) throw new Error('Not a NOOT.API');
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
    stack.res.status(stack.statusCode || this.defaultStatusCode);

    var type = stack.req.accepts(this.allowedResponseTypes) || this.defaultResponseType;

    switch (type) {
      case 'json': return this.sendJSON(stack);
      default:
        stack.pushMessage(this.api.messagesProvider.unsupportedResponseType(type));
        return stack.next(new NOOT.Errors.NotImplemented());
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
  },

  /**
   *
   */
  parseQueryFilter: function(stack, callback) {
    var ret = {};
    var map = {};
    var fields = this.fields;
    var filter = stack.query.filter;
    callback = callback || stack.next;

    for (var filterName in filter) {
      var split = filterName.split(this.constructor.OPERATOR_SEPARATOR);
      var publicPath = split[0];
      var operatorName = split[1] || 'eq';

      var field = _.find(fields, function(field) { return publicPath === field.publicPath; });

      if (!field) {
        stack.pushMessage(this.api.messagesProvider.forbiddenField(publicPath));
        return callback(new NOOT.Errors.Forbidden());
      }

      if (!field.validateOperator(operatorName)) {
        stack.pushMessage(this.api.messagesProvider.forbiddenOperator(publicPath, operatorName));
        return callback(new NOOT.Errors.Forbidden());
      }

      var operator = Operators[operatorName];

      if (!operator) {
        stack.pushMessage(this.api.messagesProvider.unsupportedOperator(publicPath, operatorName));
        return callback(new NOOT.Errors.BadRequest());
      }

      map[field.path] = map[field.path] || {};
      map[field.path][operatorName] = operator.parseFromQueryString(filter[filterName], field.parseFromQueryString);
    }

    for (var path in map) {
      var pathFilter = map[path];
      if (pathFilter.hasOwnProperty('eq')) ret[path] = pathFilter.eq;
      else ret[path] = pathFilter;
    }

    stack.query.filter = ret;
    
    return callback();
  },

  parseQuerySelect: function(stack, callback) {
    var self = this;
    callback = callback || stack.next;
    var select = stack.query.select;
    var selectable = stack.selectable;

    if (select && select.length) {
      var final = [];
      select.forEach(function(fieldName) {
        var shouldExclude =  fieldName[0] === self.constructor.EXCLUSION_CHARACTER;
        var rawFieldName = fieldName.replace(new RegExp('^' + self.constructor.EXCLUSION_CHARACTER), '');
        var childs = selectable.filter(function(selectableName) {
          return selectableName.split('.')[0] === rawFieldName;
        }).map(function(selectableName) {
          return shouldExclude ? self.constructor.EXCLUSION_CHARACTER + selectableName : selectableName;
        });
        if (childs.length) final = final.concat(childs);
        else final.push(fieldName);
      });
      stack.query.select = final;
    }

    return callback();
  },

  parseQuerySort: function(stack, callback) {
    return (callback || stack.next)();
  }

}, {

  /**
   *
   */
  DEFAULTS: {
    get methods() { return DefaultRoutes.supportedMethods; },
    get defaultStatusCode() { return NOOT.HTTP.OK; },
    get allowedResponseTypes() { return ['json']; },
    get defaultResponseType() { return 'json'; }
  },

  /**
   *
   */
  OPERATOR_SEPARATOR: '__',

  /**
   *
   */
  EQUALITY_OPERATOR: 'eq',

  EXCLUSION_CHARACTER: '-',

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