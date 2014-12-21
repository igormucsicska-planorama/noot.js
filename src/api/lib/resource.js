/**
 * Dependencies
 */
var NOOT = require('../../../')('object', 'url');
var Inflector = require('inflected');
var _ = require('lodash');
var qs = require('querystring');

var QueryMode = require('./query-mode');
var Route = require('./route');
var DefaultRoutes = require('./default-routes');

/***********************************************************************************************************************
 * NOOT.Api.Resource
 ***********************************************************************************************************************
 *
 *
 *
 *
 **********************************************************************************************************************/
var Resource = NOOT.Object.extend({

  model: null,
  apiVersion: null,
  path: '',
  maxLimit: 0,
  defaultLimit: 0,

  methods: null,

  _routes: null,
  _isComputed: false,

  selectable: null,
  _selectable: null,
  nonSelectable: null,
  writable: null,
  _writable: null,
  nonWritable: null,
  sortable: null,
  _sortable: null,
  nonSortable: null,
  filterable: null,
  _filterable: null,
  nonFilterable: null,

  /**
   * Constructor
   */
  init: function() {
    // Model is mandatory
    if (!this.model) throw new Error('NOOT resource requires a Mongoose `model`');

    // Initialize routes
    this._routes = [];

    // Path defaults to model name
    this.path = this.path || NOOT.dasherize(Inflector.pluralize(this.model.modelName));

    // Methods
    this.methods = this.methods ?
                   this.methods.map(function(method) { return method.toLowerCase(); }) :
                   Resource._DEFAULTS.methods.slice(0);

    Resource.validateMethods(this.methods);

    // Limits
    this.defaultLimit = this.defaultLimit || Resource._DEFAULTS.defaultLimit;
    this.maxLimit = this.maxLimit || Resource._DEFAULTS.maxLimit;

    // Build allowed fields
    this._buildFields();
  },

  /**
   * Build, sort and register routes on the app
   */
  getRoutes: function() {
    if (this._isComputed) return this._routes;
    this._isComputed = true;
    return this._buildRoutes();
  },

  /**
   * C . . .
   *
   * Create a new item
   *
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  create: function(req, res, next) {
    var self = this;
    var properties = this.filterFields(req.body, Resource.WRITE);
    return this.model.create(properties, function(err, item) {
      if (err) return next(err);
      return res.status(201).json({ data: self.filterFields(item.toObject(), Resource.READ) });
    });
  },

  /**
   * . R . .
   *
   * Read single/multiple item(s)
   *
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  read: function(req, res, next) {
    var id = req.param('id');
    var query = this.parseQueryString(req.query);

    if (id) {
      return this.model.findById(id, query.select, { lean: true }, function(err, item) {
        if (err) return next(err);
        if (!item) return next();
        return res.status(200).json({ data: item });
      });
    } else {
      var self = this;
      // TODO cache count by filter
      return this.model.count(query.filter, function(err, count) {
        if (err) return next(err);

        var meta = self.getMeta(req, query, count);

        if (!count) return res.json({ meta: meta, data: [] });

        return self.model.find(query.filter, query.select)
          .limit(query.limit)
          .skip(query.offset)
          .sort(query.sort)
          .exec(function(err, items) {
            if (err) return next(err);
            return res.status(200).json({ meta: meta, data: items });
          });
      });
    }
  },

  /**
   * . . U .
   *
   * Update a single item
   *
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  update: function(req, res, next) {
    var id = req.param('id');
    var properties = this.filterFields(req.body, Resource.WRITE);
    return this.model.update({ _id: id }, { $set: properties }, function(err, updated) {
      if (err) return next(err);
      if (!updated) return next();
      return res.status(204).json();
    });
  },

  /**
   * . . . D
   *
   * Delete a single item
   *
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  delete: function(req, res, next) {
    var id = req.param('id');
    return this.model.remove({ _id: id }, function(err, removed) {
      if (err) return next(err);
      if (!removed) return next();
      return res.status(204).json();
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
   * @param {Array|Object} fields
   * @param {QueryMode} queryMode
   * @returns {Array|Object}
   */
  filterFields: function(fields, queryMode) {
    if (!(queryMode instanceof QueryMode)) throw new Error('Invalid query mode: ' + queryMode);
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
   * Build routes
   *
   * @private
   */
  _buildRoutes: function() {
    var self = this;
    this._routes = this.methods.map(function(method) {
      var DefaultRoute = DefaultRoutes[method];
      return DefaultRoute.create({
        resource: self,
        handlers: [self[DefaultRoute.defaultHandler].bind(self)]
      });
    });
    return this._routes;
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
   * Default values
   */
  _DEFAULTS: {
    methods: ['get', 'put', 'patch', 'delete', 'post'],
    maxLimit: 1000,
    defaultLimit: 20
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
 * @module
 */
module.exports = Resource;