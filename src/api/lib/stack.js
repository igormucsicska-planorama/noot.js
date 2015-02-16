/**
 * Dependencies
 */
var _ = require('lodash');
var NOOT = require('../../../')('object', 'http');
var flatten = require('flat');
var qs = require('querystring');

var Utils = require('./utils');
var Queryable = require('./interfaces/queryable');
var FilterModes = require('./filter-modes');

/***********************************************************************************************************************
 * @class Stack
 * @namespace NOOT.API
 * @extends NOOT.Object
 * @uses NOOT.API.Queryable
 * @constructor
 **********************************************************************************************************************/
var Stack = NOOT.Object.extend(Queryable).extend({

  /**
   * @property req
   * @type IncomingMessage
   */
  req: null,

  /**
   * @property res
   * @type Response
   */
  res: null,

  /**
   * @property next
   * @type Function
   */
  next: null,

  /**
   *
   *
   * @property package
   * @type Object
   */
  package: null,

  /**
   * @property statusCode
   * @type Number
   */
  statusCode: null,

  /**
   * @property createdOn
   * @type Date
   */
  createdOn: null,

  /**
   *
   */
  query: null,

  params: null,

  body: null,

  route: null,

  resource: null,

  /**
   * Constructor
   */
  init: function() {
    NOOT.defaults(this, Stack.DEFAULTS);
    NOOT.required(this, 'req', 'res', 'route', '__queryableParent');
    this.computeQueryable();
    this.resource = this.route.resource;
    this.body = this.req.body;
    this.params = this.req.params;
  },

  /**
   *
   *
   * @method parseQueryString
   */
  parseQueryString: function() {
    var query = this.req.query || {};

    this.query = {
      raw: query,
      select: query.select ? Utils.parseFieldsList(query.select) : this.selectable,
      filter: _.omit(query, Stack.QUERY_STRING_RESERVED_WORDS),
      sort: query.sort ? Utils.parseFieldsList(query.sort) : '',
      limit: Math.min(parseInt(query.limit, 10) || this.defaultGetLimit, this.maxGetLimit),
      offset: parseInt(query.offset, 10) || 0
    };
  },

  /**
   *
   *
   * @method setStatus
   * @param statusCode
   * @return {Stack}
   * @chainable
   */
  setStatus: function(statusCode) {
    this.statusCode = statusCode;
    return this;
  },

  /**
   *
   *
   * @method setData
   * @param data
   * @return {Stack}
   * @chainable
   */
  setData: function(data) {
    this.package.data = data;
    return this;
  },

  /**
   *
   * @method pushData
   * @param data
   * @return {Stack}
   * @chainable
   */
  pushData: function(data) {
    var pack = this.package;
    if (!pack.data) pack.data = [];
    else if (!NOOT.isArray(pack.data)) pack.data = [pack.data];
    pack.data.push(data);
    return this;
  },

  /**
   *
   *
   *
   * @chainable
   * @param meta
   * @return {Stack}
   * @chainable
   */
  setMeta: function(meta) {
    this.package.meta = meta;
    return this;
  },

  /**
   *
   * @method appendMeta
   * @param key
   * @param value
   * @return {Stack}
   * @chainable
   */
  appendMeta: function(key, value) {
    this.package.meta = this.package.meta || {};
    this.package.meta[key] = value;
    return this;
  },

  /**
   *
   *
   * @method extendMeta
   * @param {Object} obj
   * @return {Stack}
   * @chainable
   */
  extendMeta: function(obj) {
    this.package.meta = this.package.meta || {};
    _.extend(this.package.meta, obj);
    return this;
  },

  /**
   *
   *
   *
   * @param obj
   */
  append: function(obj) {
    _.extend(this.package, obj);
    return this;
  },

  /**
   *
   *
   *
   * @param total
   * @chainable
   */
  createManyMeta: function(total) {
    total = total || 0;

    this.extendMeta({ total: total, limit: this.query.limit, offset: this.query.offset })
        .extendMeta(this.getManyMetaNavLinks(total));

    return this;
  },


  /**
   *
   *
   *
   * @param total
   * @return {{next: String|null, prev: String|null}}
   */
  getManyMetaNavLinks: function(total) {
    var limit = this.query.limit;
    var offset = this.query.offset;

    var next = null;
    var prev = null;

    var nextOffset = offset + limit;
    var prevOffset = offset - limit;

    if (nextOffset < total) next = this.getManyMetaNavLink(limit, nextOffset);
    if (prevOffset >= 0) prev = this.getManyMetaNavLink(limit, prevOffset);

    return { next: next, prev: prev };
  },

  /**
   *
   *
   *
   * @param limit
   * @param offset
   * @return {String}
   */
  getManyMetaNavLink: function(limit, offset) {
    var queryString = qs.stringify(_.extend({}, this.query.raw, { limit: limit, offset: offset }));
    return this.req._parsedUrl.path + '?' + qs.unescape(queryString);
  },

  /**
   *
   *
   * @method pushMessage
   * @param message
   * @chainable
   */
  pushMessage: function() {
    this.package.messages = this.package.messages || [];
    this.package.messages.push(NOOT.makeArray(arguments).join(' '));
    return this;
  },

  /**
   *
   *
   * @method setMessages
   * @param messages
   * @chainable
   */
  setMessages: function(messages) {
    if (!NOOT.isArray(messages)) messages = [messages];
    this.package.messages = messages;
    return this;
  },

  /**
   *
   *
   * @method addSelectable
   * @param {String} value
   * @chainable
   */
  addSelectable: function(value) {
    this._addAllowedFieldsForType('selectable', value);
    return this;
  },

  /**
   *
   *
   * @method addFilterable
   * @param {String} value
   * @chainable
   */
  addFilterable: function(value) {
    this._addAllowedFieldsForType('filterable', value);
    return this;
  },

  /**
   *
   *
   * @method addSortable
   * @param {String} value
   * @chainable
   */
  addSortable: function(value) {
    this._addAllowedFieldsForType('sortable', value);
    return this;
  },

  /**
   *
   *
   * @method addWritable
   * @param {String} value
   * @chainable
   */
  addWritable: function(value) {
    this._addAllowedFieldsForType('writable', value);
    return this;
  },

  /**
   *
   *
   * @method removeSelectable
   * @param {String} value
   * @chainable
   */
  removeSelectable: function(value) {
    this._removeAllowedFieldsForType('selectable', value);
    return this;
  },

  /**
   *
   *
   * @method removeFilterable
   * @param {String} value
   * @chainable
   */
  removeFilterable: function(value) {
    this._removeAllowedFieldsForType('filterable', value);
    return this;
  },

  /**
   *
   *
   * @method removeSortable
   * @param {String} value
   * @chainable
   */
  removeSortable: function(value) {
    this._removeAllowedFieldsForType('sortable', value);
    return this;
  },

  /**
   *
   *
   * @method removeWritable
   * @param {String} value
   * @chainable
   */
  removeWritable: function(value) {
    this._removeAllowedFieldsForType('writable', value);
    return this;
  },

  /**
   *
   *
   * @method setSelectable
   * @param {String} value
   * @chainable
   */
  setSelectable: function(value) {
    this._setAllowedFieldsForType('selectable', value);
    return this;
  },

  /**
   *
   *
   * @method setFilterable
   * @param {String} value
   * @chainable
   */
  setFilterable: function(value) {
    this._setAllowedFieldsForType('filterable', value);
    return this;
  },

  /**
   *
   *
   * @method setSortable
   * @param {String} value
   * @chainable
   */
  setSortable: function(value) {
    this._setAllowedFieldsForType('sortable', value);
    return this;
  },

  /**
   *
   *
   * @method setWritable
   * @param {String} value
   * @chainable
   */
  setWritable: function(value) {
    this._setAllowedFieldsForType('writable', value);
    return this;
  },

  /**
   *
   *
   *
   * @param properties
   * @param filterMode
   * @returns {*}
   */
  getInvalidProperties: function(properties, filterMode) {
    if (!FilterModes.hasValue(filterMode)) throw new Error('Invalid filter mode: ' + filterMode);
    if (properties && properties.toJSON) properties = properties.toJSON();

    var validFields;

    switch (filterMode) {
      case FilterModes.READ: validFields = this.selectable; break;
      case FilterModes.SELECT: validFields = this.selectable; break;
      case FilterModes.WRITE: validFields = this.writable; break;
      case FilterModes.FILTER: validFields = this.filterable; break;
      case FilterModes.SORT: validFields = this.sortable; break;
    }

    var paths = NOOT.isPlainObject(properties) ?
      Object.keys(flatten(properties), { safe: true }) :
      NOOT.isArray(properties) ?
        properties :
        [];

    return _.difference(paths, validFields);
  },


  /**
   * Filter fields depending on query mode (read, write, select, sort...)
   *
   * @method filterProperties
   * @param {Array|Object} properties
   * @param {NOOT.API.FilterMode} filterMode
   * @return {Array|Object}
   */
  filterProperties: function(properties, filterMode) {
    if (!FilterModes.hasValue(filterMode)) throw new Error('Invalid filter mode: ' + filterMode);
    if (properties && properties.toJSON) properties = properties.toJSON();

    switch (filterMode) {
      case FilterModes.READ: return NOOT.pickProperties(properties, this.selectable);
      case FilterModes.SELECT: return this.parseFieldsList(properties, this.selectable);
      case FilterModes.WRITE: return NOOT.pickProperties(properties, this.writable);
      case FilterModes.FILTER: return _.pick(properties, this.filterable);
      case FilterModes.SORT: return this.parseFieldsList(properties, this.sortable);
    }
  },

  /**
   * Parse fields from a comma separated list
   *
   * @method parseFieldsList
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
   *
   *
   *
   * @param type
   * @param fields
   */
  _addAllowedFieldsForType: function(type, fields) {
    fields = NOOT.isArray(fields) ? fields : [fields];
    this._setAllowedFieldsForType(type, this[type].concat(fields));
  },

  /**
   *
   *
   *
   * @param type
   * @param fields
   */
  _removeAllowedFieldsForType: function(type, fields) {
    fields = NOOT.isArray(fields) ? fields : [fields];
    this._setAllowedFieldsForType(type, _.difference(this[type], fields));
  },

  /**
   *
   *
   *
   * @param type
   * @param fields
   */
  _setAllowedFieldsForType: function(type, fields) {
    // TODO make fields unique and check existence in `fields`
    this['_' + type] = fields;
  }

}, {

  /**
   * @property DEFAULTS
   * @type Object
   * @static
   */
  DEFAULTS: {
    package: {
      messages: []
    },
    body: {},
    headers: null
  },

  /**
   * List of reserved words to be used in query string.
   *
   * @property QUERY_STRING_RESERVED_WORDS
   * @type Array of String
   * @static
   */
  QUERY_STRING_RESERVED_WORDS: ['select', 'sort', 'limit', 'offset']

});


module.exports = Stack;