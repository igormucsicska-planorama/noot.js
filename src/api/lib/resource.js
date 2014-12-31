/**
 * Dependencies
 */
var NOOT = require('../../../')('object', 'url', 'time', 'errors', 'http');
var Inflector = require('inflected');
var _ = require('lodash');
var qs = require('querystring');
var http = require('http');

var QueryMode = require('./query-mode');
var Route = require('./route');
var DefaultRoutes = require('./default-routes');
var CountCache = require('./count-cache');


/***********************************************************************************************************************
 * @class Resource
 * @namespace NOOT.API
 * @constructor
 **********************************************************************************************************************/
var Resource = NOOT.Object.extend({

  model: null,
  path: '',
  maxLimit: 0,
  defaultLimit: 0,
  countCacheExpiration: undefined,
  defaultResponseStatusCode: undefined,
  allowedResponseFields: undefined,
  areFindsLean: false,
  defaultResponseType: undefined,
  allowedResponseTypes: undefined,

  methods: undefined,

  _routes: undefined,

  selectable: undefined,
  _selectable: undefined,
  nonSelectable: undefined,
  writable: undefined,
  _writable: undefined,
  nonWritable: undefined,
  sortable: undefined,
  _sortable: undefined,
  nonSortable: undefined,
  filterable: undefined,
  _filterable: undefined,
  nonFilterable: undefined,

  /**
   * Constructor
   */
  init: function() {
    NOOT.required(this, 'model');
    if (!(this.api instanceof require('../index'))) throw new Error('Not a NOOT.API');
    _.defaults(this, Resource._DEFAULTS);
    Resource.validateMethods(this.methods);
    this._buildPath();
    this._buildFields();
    this._countCache = CountCache.create({
      model: this.model,
      expiration: this.countCacheExpiration
    });
    this._buildRoutes();
  },

  _buildRoutes: function() {
    var self = this;
    var routes = (NOOT.makeArray(this.routes) || []).concat(this.methods.map(function(methodName) {
      return DefaultRoutes[Inflector.classify(methodName)];
    }));

    this._routes = routes.map(function(route) {
      return route.create({ resource: self });
    });
  },

  _buildPath: function() {
    var path = this.path || NOOT.dasherize(Inflector.pluralize(this.model.modelName));
    this.path = NOOT.Url.join('/', this.api.name || '', path).replace(/\/$/, '');
  },


  getCount: function(filter, callback) {
    return this._countCache.getCount(filter, callback);
  },

  /**
   * Register a single route.
   *
   * @method registerRoute
   * @chainable
   * @param {Class} route A {{#crossLink "NOOT.API.Route"}}{{/crossLink}} **class** that will be instantiated
   * by the resource
   */
  registerRoute: function(route) {
    if (!Route.detect(route)) {
      if (route instanceof Route) throw new Error('You must register classes, not instances');
      throw new Error('Not a subclass of NOOT.API.Route');
    }
    this._routes.push(route);
    return this;
  },

  /**
   * Register multiple routes.
   *
   * @method registerRoutes
   * @chainable
   * @param {Class} routes,... A list of arguments ({{#crossLink "NOOT.API.Route"}}{{/crossLink}} **classes**)
   */
  registerRoutes: function() {
    _.flatten(NOOT.makeArray(arguments)).forEach(this.registerRoute.bind(this));
    return this;
  },

  /**
   * Create a new item
   *
   * @async
   * @method post
   * @param {Request} req
   * @param {Function} callback
   */
  post: function(req, callback) {
    var self = this;
    return this.model.create(this.filterFields(req.body, Resource.WRITE), function(err, item) {
      if (err) return callback(new NOOT.Errors.MongooseError(err));
      return callback(null, { data: self.filterFields(item.toObject(), Resource.READ), statusCode: NOOT.HTTP.Created });
    });
  },

  get: function(req, callback) {
    return this.parseId(req) ? this.getSingle(req, callback) : this.getMultiple(req, callback);
  },

  /**
   * Read a single item.
   *
   * @method getSingle
   * @async
   * @param {Request} req
   * @param {Function} callback
   */
  getSingle: function(req, callback) {
    var query = this.parseQueryString(req.query);
    return this.model.findById(this.parseId(req), query.select, { lean: this.areFindsLean }, function(err, item) {
      if (err) return callback(new NOOT.Errors.MongooseError(err));
      if (!item) return callback(new NOOT.Errors.NotFound());
      return callback(null, { data: item, statusCode: NOOT.HTTP.OK });
    });
  },

  /**
   * Read multiple items.
   *
   * @method getMultiple
   * @async
   * @param {Request} req
   * @param {Function} callback
   */
  getMultiple: function(req, callback) {
    var self = this;
    var query = this.parseQueryString(req.query);

    return this.getCount(query.filter, function(err, count) {
      if (err) return callback(err);

      var meta = self.getMeta(req, query, count);

      if (!count) return callback(null, { meta: meta, data: [] });

      return self.model.find(query.filter, query.select)
        .limit(query.limit)
        .skip(query.offset)
        .sort(query.sort)
        .setOptions({ lean: self.areFindsLean })
        .exec(function(err, items) {
          if (err) return callback(new NOOT.Errors.MongooseError(err));
          return callback(null, { meta: meta, data: items, statusCode: NOOT.HTTP.OK });
        });
    });
  },


  parseId: function(req) {
    return req.param(req.idProperty || 'id');
  },

  /**
   *
   *
   * @method createResponse
   * @param {Response} res
   * @param {Object} [data]
   * @param {Number} [status]
   */
  createResponse: function(res, data, status) {
    if (!(res instanceof http.ServerResponse)) throw new Error('Not an http response');

    if (!status && NOOT.isNumber(data)) {
      status = data;
      data = undefined;
    }

    res.status(status || data && data.statusCode || this.defaultResponseStatusCode);

    return this.getResponseHandler(res)(res, data);
  },


  getResponseHandler: function(res) {
    var type = res.req.accepts(this.allowedResponseTypes) || this.defaultResponseType;
    var handler;
    switch (type) {
      case 'json': handler = this.sendJSON; break;
      default: handler = this.sendJSON;
    }
    return handler.bind(this);
  },

  sendJSON: function(res, json) {
    return res.json(json);
  },

  /**
   * @method patch
   * @async
   * @param {Request} req
   * @param {Function} callback
   */
  patch: function(req, callback) {
    var properties = this.filterFields(req.body, Resource.WRITE);
    return this.model.update({ _id: this.parseId(req) }, { $set: properties }, function(err, updated) {
      if (err) return callback(new NOOT.Errors.MongooseError(err));
      if (!updated) return callback(new NOOT.Errors.NotFound());
      return callback(null, { statusCode: NOOT.HTTP.NoContent });
    });
  },

  /**
   * Delete a single item
   *
   * @method delete
   * @async
   * @param {Request} req
   * @param {Function} callback
   */
  delete: function(req, callback) {
    return this.model.remove({ _id: this.parseId(req) }, function(err, removed) {
      if (err) return callback(new NOOT.Errors.MongooseError(err));
      if (!removed) return callback(new NOOT.Errors.NotFound());
      return callback(null, { statusCode: NOOT.HTTP.NoContent });
    });
  },

  /**
   * Parse offset, limit, filters, sorting and select from request query string
   *
   * @param {Object} query
   * @returns {Object}
   */
  parseQueryString: function(query) {
    return {
      offset: parseInt(query.offset, 10) || 0,
      limit: Math.min(parseInt(query.limit, 10) || this.defaultLimit, this.maxLimit),
      filter: this.filterFields(query, Resource.FILTER),
      sort: this.filterFields(query.sort, Resource.SORT) || '-_id',
      select: this.filterFields(query.select, Resource.SELECT) || this._selectable.join(' ')
    };
  },

  /**
   * Build metadata for multiple reads (ie, GET without identifier)
   *
   * @param {Request} req
   * @param {Object} query
   * @param {Number} count
   */
  getMeta: function(req, query, count) {
    var nextOffset = query.offset + query.limit;
    var prevOffset = query.offset - query.limit;
    return {
      limit: query.limit,
      offset: query.offset,
      total: count,
      next: nextOffset < count ? this.getMetaNavLink(req, nextOffset, query.limit) : null,
      prev: prevOffset >= 0 ? this.getMetaNavLink(req, prevOffset, query.limit) : null
    };
  },

  /**
   * Build new uri from the original, modifying limit and offset parameters
   *
   * @param {Request} req
   * @param {Number} offset
   * @param {Number} limit
   * @returns {String}
   */
  getMetaNavLink: function(req, offset, limit) {
    var query = _.clone(req.query);
    query.offset = offset;
    query.limit = limit;
    return req._parsedUrl.pathname + '?' + qs.unescape(qs.stringify(query));
  },

  /**
   * Filter fields depending on query mode (read, write, select, sort...)
   *
   * @method filterFields
   * @param {Array|Object} fields
   * @param {QueryMode} queryMode
   * @return {Array|Object}
   */
  filterFields: function(fields, queryMode) {
    if (!(queryMode instanceof QueryMode)) throw new Error('Invalid query mode: ' + queryMode);
    if (fields && fields.toJSON) fields = fields.toJSON();

    switch (queryMode) {
      case Resource.READ: return _.pick(fields, this._selectable);
      case Resource.SELECT: return this.parseFieldsList(fields, this._selectable);
      case Resource.WRITE: return _.pick(fields, this._writable);
      case Resource.FILTER: return _.pick(fields, this._filterable);
      case Resource.SORT: return this.parseFieldsList(fields, this._sortable);
    }
  },

  /**
   * Parse fields from a comma separated list
   *
   * @param {String} fieldsStr
   * @param {Array} allowedFields
   * @returns {String}
   */
  parseFieldsList: function(fieldsStr, allowedFields) {
    return (fieldsStr || '')
      .toString()
      .split(/\s*,\s*/)
      .filter(function(field) { return ~allowedFields.indexOf(field.replace(/^(\+|-)/, '')); })
      .join(' ');
  },

  /**
   * Build allowed fields for all types
   *
   * @private
   */
  _buildFields: function() {
    var self = this;
    ['selectable', 'sortable', 'writable', 'filterable'].forEach(this._buildFieldsForType.bind(this));
    // Security : don't allow sorting, writing and filtering on non selectable fields
    ['sortable', 'writable', 'filterable'].forEach(function(type) {
      self['_' + type] = _.intersection(self._selectable, self['_' + type]);
    });
  },

  /**
   * Build allowed fields for a single type
   *
   * @param {String} type
   * @private
   */
  _buildFieldsForType: function(type) {
    var allowed = this[type];
    var disallowed = this['non' + Inflector.classify(type)];
    if (!allowed) allowed = this._getModelPaths();
    if (disallowed) allowed = allowed.filter(function(field) { return !~disallowed.indexOf(field); });
    this['_' + type] = allowed;
  },

  /**
   * Get an exhaustive list of paths for model (nested paths use dot notation)
   *
   * @returns {Array}
   * @private
   */
  _getModelPaths: function() {
    return Object.keys(this.model.schema.paths);
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
    get maxLimit() { return 1000; },
    get defaultLimit() { return 20; },
    get countCacheExpiration() { return NOOT.Time.SECOND; },
    get defaultResponseStatusCode() { return NOOT.HTTP.OK; },
    get allowedResponseFields() { return ['data', 'message', 'error', 'meta', 'code']; },
    get defaultResponseType() { return 'json'; },
    get allowedResponseTypes() { return ['json']; }
  },

  /**
   * Query modes
   */
  READ: QueryMode.create({}),
  SELECT: QueryMode.create({}),
  WRITE: QueryMode.create({}),
  SORT: QueryMode.create({}),
  FILTER: QueryMode.create({}),

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