var NOOT = require('../../../')('object', 'http');
var _ = require('lodash');
var Queryable = require('./queryable');
var QueryModes = require('./query-modes');
var qs = require('querystring');

/***********************************************************************************************************************
 * @class Stack
 * @namespace NOOT.API
 * @extends NOOT.Object
 * @uses NOOT.API.Queryable
 * @constructor
 **********************************************************************************************************************/
var Stack = NOOT.Object.extend(Queryable).extend({
  req: null,
  res: null,
  next: null,

  package: null,

  route: null,

  init: function() {
    NOOT.required(this, 'req', 'res', 'route');
    this.package = Stack.getDefaultPackage();
    this._computeQueryable();
    this.query = this.parseQueryString(this.req.query);
    this.body = this.req.body || {};
  },

  status: function(status) {
    this.package.statusCode = status;
    return this;
  },

  data: function(data) {
    this.package.data = data;
    return this;
  },

  meta: function(meta) {
    this.package.meta = meta;
    return this;
  },

  message: function(message) {
    this.package.message = message;
    return this;
  },

  setSelectable: function() { return this._setFields('selectable', arguments); },

  setFilterable: function() { return this._setFields('filterable', arguments); },

  setSortable: function() { return this._setFields('sortable', arguments); },

  setWritable: function() { return this._setFields('writable', arguments); },

  /**
   * Parse offset, limit, filters, sorting and select from request query string
   *
   * @param {Object} query
   * @returns {Object}
   */
  parseQueryString: function(query) {
    return {
      offset: parseInt(query.offset, 10) || 0,
      limit: Math.min(parseInt(query.limit, 10) || this.readDefaultLimit, this.readMaxLimit),
      filter: this.filterFields(query, QueryModes.FILTER),
      sort: this.filterFields(query.sort, QueryModes.SORT) || '-_id',
      select: this.filterFields(query.select, QueryModes.SELECT) || this._selectable.join(' ')
    };
  },

  /**
   * Build metadata for multiple reads (ie, GET without identifier)
   *
   * @param {Number} count
   */
  getMeta: function(count) {
    var query = this.query;

    var nextOffset = query.offset + query.limit;
    var prevOffset = query.offset - query.limit;

    return {
      limit: query.limit,
      offset: query.offset,
      total: count,
      next: (query.limit && nextOffset < count) ? this.getMetaNavLink(nextOffset, query.limit) : null,
      prev: (query.limit && prevOffset >= 0) ? this.getMetaNavLink(prevOffset, query.limit) : null
    };
  },


  get model() { return this.route.model; },

  /**
   * Build new uri from the original, modifying limit and offset parameters
   *
   * @param {Number} offset
   * @param {Number} limit
   * @returns {String}
   */
  getMetaNavLink: function(offset, limit) {
    var query = _.clone(this.req.query);
    query.offset = offset;
    query.limit = limit;
    return this.req._parsedUrl.pathname + '?' + qs.unescape(qs.stringify(query));
  },

  /**
   *
   *
   * @chainable
   * @method _setFields
   * @param {String} fieldName
   * @param {Array|arguments} args
   * @return {Stack}
   * @private
   */
  _setFields: function(fieldName, args) {
    var replace = !!NOOT.isArray(args[0]);
    args = replace ? args[0] : _.flatten(args);
    if (replace || !this[fieldName]) this[fieldName] = args;
    else this[fieldName].push.apply(this[fieldName], args);
    if (fieldName === 'selectable') this._buildFields();
    else this._buildFieldsForType(fieldName);
    return this;
  }

}, {
  getDefaultPackage: function() {
    return {
      statusCode: NOOT.HTTP.OK
    };
  }
});


module.exports = Stack;