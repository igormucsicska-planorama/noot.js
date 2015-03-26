/**
 * Dependencies
 */
var _ = require('lodash');
var NOOT = require('../../../../../index')('object', 'http', 'errors');
var async = require('async');
var flatten = require('flat');

var Operators = require('./../../operators/index');
var Authable = require('./../../mixins/authable');
var Queryable = require('./../../mixins/queryable');
var DefaultRoutes = require('./../../default-routes/index');
var Route = require('./../../route');

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
   * @property methods
   * @type Array
   */
  methods: null,

  /**
   * @property detailMethods
   * @type Array
   */
  detailMethods: null,

  /**
   * @property manyMethods
   * @type Array
   */
  manyMethods: null,

  /**
   * @property defaultStatusCode
   * @type Number
   */
  defaultStatusCode: null,

  /**
   * @property allowedResponseTypes
   * @type Array
   */
  allowedResponseTypes: null,

  /**
   * @property defaultResponseType
   * @type String
   */
  defaultResponseType: null,

  /**
   * @property fields
   * @type Object
   */
  fields: null,

  /**
   * @property fieldsPath
   * @type Array
   * @readOnly
   */
  get fieldsPaths() { return NOOT.isObject(this.fields) ? Object.keys(this.fields) : []; },

  /**
   * Constructor
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
   * Will be called b the constructor in case `fields` is not defined. This method allows you to process
   *
   * @method getFields
   */
  getFields: function() {},

  /**
   * In charge of parsing and validating default routes methods defined in `methods`, `detailMethods` and `manyMethods`.
   *
   * @method _buildMethods
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
      all = this.constructor.DEFAULT_ROUTES_METHODS;
    }

    // Assign final values and make them readOnly
    NOOT.makeReadOnly(this, 'detailMethods', detail || all);
    NOOT.makeReadOnly(this, 'manyMethods', many || all);
    NOOT.makeReadOnly(this, 'methods', all);
  },

  /**
   * In charge of creating the final `routes` property. This method will create an array of NOOT.API.Route instances
   * to be used by the resource. The final array will contain both default and user defined routes.
   *
   * @method _buildRoutes
   * @private
   */
  _buildRoutes: function() {
    var self = this;
    var routes = this.routes || [];

    this.detailMethods.forEach(function(method) {
      if (DefaultRoutes[method].prototype.isDetailable) routes.push(DefaultRoutes[method].extend({ isDetail: true }));
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
   * In charge of formatting the response that will be sent. Here you can format the stack's package and define how
   * the response will look like.
   *
   * @method formatResponsePackage
   * @param {NOOT.API.Stack} stack
   * @param {Function} [callback]
   */
  formatResponsePackage: function(stack, callback) {
    callback = callback || stack.next;
    var pack = stack.package;
    if (!pack.messages.length) delete pack.messages;
    stack.package = _.pick(pack, ['data', 'error', 'message', 'messages', 'meta']);
    return callback();
  },

  /**
   * In charge of calling the right handler in order to respond to the request. If no `accept` header is provided by
   * the request, the `defaultResponseType` is used. If the provided `accept` is not supported, a
   * NOOT.Errors.NotImplemented error is sent as a response.
   *
   * @method sendResponse
   * @param {NOOT.API.Stack} stack
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
   * Sends stack's package as a JSON response.
   *
   * @method sendJSON
   * @param {NOOT.API.Stack} stack
   */
  sendJSON: function(stack) {
    return stack.res.json(stack.package);
  },

  /**
   * Middleware to parse and validate stack's filter. If `query.filter` contains a field that is not `filterable`, a
   * NOOT.Errors.Forbidden error is passed to the callback.
   *
   * @method parseQueryFilter
   * @param {NOOT.API.Stack} stack
   * @param {Function} [callback]
   */
  parseQueryFilter: function(stack, callback) {
    var self = this;
    var ret = {};
    var map = {};
    var fields = this.fields;
    var filter = stack.query.filter;
    callback = callback || stack.next;

    return async.each(Object.keys(filter), function(filterName, cb) {
      var split = filterName.split(self.constructor.OPERATOR_SEPARATOR);
      var publicPath = split[0];
      var operatorName = split[1] || self.constructor.EQUALITY_OPERATOR;

      var operator = Operators[operatorName];
      var field = _.find(fields, function(field) { return publicPath === field.publicPath; });

      if (!field) {
        stack.pushMessage(self.api.messagesProvider.forbiddenField(publicPath));
        return callback(new NOOT.Errors.Forbidden());
      }

      if (!field.validateOperator(operatorName)) {
        stack.pushMessage(self.api.messagesProvider.forbiddenOperator(publicPath, operatorName));
        return callback(new NOOT.Errors.Forbidden());
      }

      if (!operator) {
        stack.pushMessage(self.api.messagesProvider.unsupportedOperator(publicPath, operatorName));
        return callback(new NOOT.Errors.BadRequest());
      }

      map[field.path] = map[field.path] || {};
      operator.parseFromQueryString(filter[filterName], field.parseFromQueryString, function(err, value) {
        if (err) return cb(err);
        map[field.path][operatorName] = value;
        return cb();
      });

    }, function(err) {
      if (err) return callback(err);

      for (var path in map) {
        var pathFilter = map[path];
        var unwildcardedPath = self.constructor.removeWildcardsFromPath(path);
        if (pathFilter.hasOwnProperty(self.constructor.EQUALITY_OPERATOR)) ret[unwildcardedPath] = pathFilter.eq;
        else ret[unwildcardedPath] = pathFilter;
      }

      stack.query.filter = ret;

      return callback();
    });
  },

  /**
   * Middleware to parse and validate stack's select. If `query.select` contains a field that is not `selectable`, a
   * NOOT.Errors.Forbidden error is passed to the callback.
   *
   * @method parseQuerySelect
   * @param {NOOT.API.Stack} stack
   * @param {Function} [callback]
   */
  parseQuerySelect: function(stack, callback) {
    var self = this;
    callback = callback || stack.next;
    var select = stack.query.select;
    var selectable = stack.selectable;
    var isValid = true;

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
        if (childs.length) {
          final = final.concat(childs);
        } else {
          if (_.contains(selectable, rawFieldName)) {
            final.push(self.constructor.removeWildcardsFromPath(fieldName));
          } else {
            isValid = false;
            stack.pushMessage(self.api.messagesProvider.forbiddenField(rawFieldName, 'select'));
          }
        }
      });
      stack.query.select = final;
    }

    return callback(isValid ? null : new NOOT.Errors.Forbidden());
  },

  /**
   * Middleware to parse and validate stack's sort. If `query.sort` contains a field that is not `sortable`, a
   * NOOT.Errors.Forbidden error is passed to the callback.
   *
   * @method parseQuerySort
   * @param {NOOT.API.Stack} stack
   * @param {Function} [callback]
   */
  parseQuerySort: function(stack, callback) {
    var self = this;
    callback = callback || stack.next;
    var sort = stack.query.sort;
    var sortable = stack.sortable;
    var isValid = true;

    if (sort && sort.length) {
      sort.forEach(function(fieldName) {
        fieldName = fieldName.replace(new RegExp('^' + self.constructor.EXCLUSION_CHARACTER), '');
        if (!_.contains(sortable, fieldName)) {
          isValid = false;
          stack.pushMessage(self.api.messagesProvider.forbiddenField(fieldName, 'sort'));
        }
      });
    }

    return callback(isValid ? null : new NOOT.Errors.Forbidden());
  },

  /**
   * Middleware to parse and validate stack's body. If `body` contains a field that is not `writable`, a
   * NOOT.Errors.Forbidden error is passed to the callback.
   *
   * @method parseQueryBody
   * @param {NOOT.API.Stack} stack
   * @param {Function} [callback]
   */
  parseQueryBody: function(stack, callback) {
    var self = this;
    var writable = stack.writable;
    callback = callback || stack.next;
    var isValid = true;
    var body = NOOT.isArray(stack.body) ? stack.body : [stack.body];

    body.forEach(function(item) {
      Object.keys(flatten(item)).forEach(function(key) {
        var wildcarded = self.constructor.replaceReferenceWithWildcard(key);
        var unaddressed = key.replace(/\.\d+$/, '');

        if (
          !_.contains(writable, key) &&
          !_.contains(writable, wildcarded) &&
          !_.contains(writable, unaddressed)
        ) {
          isValid = false;
          stack.pushMessage(self.api.messagesProvider.forbiddenField(key, 'write'));
        }
      });
    });

    return callback(isValid ? null : new NOOT.Errors.Forbidden());
  }

}, {

  /**
   * @property DEFAULTS
   * @type Object
   * @static
   */
  DEFAULTS: {
    get methods() { return DefaultRoutes.supportedMethods; },
    get defaultStatusCode() { return NOOT.HTTP.OK; },
    get allowedResponseTypes() { return ['json']; },
    get defaultResponseType() { return 'json'; }
  },

  /**
   * @property OPERATOR_SEPARATOR
   * @type String
   * @static
   */
  OPERATOR_SEPARATOR: '__',

  /**
   * @property EQUALITY_OPERATOR
   * @type String
   * @static
   */
  EQUALITY_OPERATOR: 'eq',

  /**
   * @property EXCLUSION_CHARACTER
   * @type String
   * @static
   */
  EXCLUSION_CHARACTER: '-',

  /**
   * @property WILDCARD
   * @type String
   * @static
   */
  WILDCARD: '$',

  /**
   * Validates an HTTP method against those that are supported by NOOT.API.DefaultRoutes. If the parameter method is not
   * supported, an error will be thrown.
   *
   * @method validateDefaultRouteMethod
   * @param {String} method
   * @static
   */
  validateDefaultRouteMethod: function(method) {
    if (!_.contains(DefaultRoutes.supportedMethods, method.toLowerCase())) {
      throw new Error('Invalid method for auto generated route: ' + method);
    }
  },

  /**
   * Append the wildcard with separators to the path
   *
   * @method appendWildcardToPath
   * @param {String} path
   * @return {String}
   */
  appendWildcardToPath: function (path) {
    return [path, '.', this.WILDCARD, '.'].join('');
  },

  /**
   * Remove wildcards from the given path
   *
   * method removeWildcardsFromPath
   * @param {String} path
   * @return {String}
   */
  removeWildcardsFromPath: function (path) {
    return path.replace(new RegExp('.' + '\\' + this.WILDCARD + '.'), '.');
  },

  /**
   * Remove references coming from flattening (eg. key.0.value) and replace with the wildcard (eg. key.$.value)
   *
   * @method replaceReferenceWithWildcard
   * @param {String} path
   * @return {String}
   */
  replaceReferenceWithWildcard: function (path) {
    return path.replace(/\.\d+\./, '.' + this.WILDCARD + '.');
  }

});


/**
 * @exports
 */
module.exports = Resource;