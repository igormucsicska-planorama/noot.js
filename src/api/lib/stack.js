var NOOT = require('../../../')('object', 'http');
var _ = require('lodash');
var qs = require('querystring');

var Queryable = require('./queryable');
var Filters = require('./filters');
var ConditionsParser = require('./conditions-parser');

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

  _conditionsParser: null,

  get model() { return this.route.model; },

  init: function() {
    NOOT.required(this, 'req', 'res', 'route');
    this.package = Stack.getDefaultPackage();
    this._computeQueryable();
    this._conditionsParser = ConditionsParser.create({ fields: this._filterable, operators: this._allowedOperators });
    this.query = this.parseQueryString(this.req.query);
    this.body = this.req.body || {};
  },

  /**
   *
   *
   *
   * @chainable
   * @param status
   * @returns {Stack}
   */
  status: function(status) {
    this.package.statusCode = status;
    return this;
  },

  /**
   *
   *
   *
   * @chainable
   * @param data
   * @returns {Stack}
   */
  data: function(data) {
    this.package.data = data;
    return this;
  },

  /**
   *
   *
   *
   * @chainable
   * @param meta
   * @returns {Stack}
   */
  meta: function(meta) {
    this.package.meta = meta;
    return this;
  },

  /**
   *
   *
   *
   * @chainable
   * @param message
   * @returns {Stack}
   */
  message: function(message) {
    this.package.message = message;
    return this;
  },

  /**
   *
   *
   *
   * @chainable
   * @returns {Stack}
   */
  setSelectable: function() { return this._setFields('selectable', arguments); },

  /**
   *
   *
   *
   * @chainable
   * @returns {Stack}
   */
  setFilterable: function() { return this._setFields('filterable', arguments); },

  /**
   *
   *
   *
   * @chainable
   * @returns {Stack}
   */
  setSortable: function() { return this._setFields('sortable', arguments); },

  /**
   *
   *
   *
   * @chainable
   * @returns {Stack}
   */
  setWritable: function() { return this._setFields('writable', arguments); },

  /**
   * Parse offset, limit, filters, sort and select from request query string
   *
   * @method parseQueryString
   * @param {Object} query
   * @return {Object}
   */
  parseQueryString: function(query) {
    return {
      offset: parseInt(query.offset, 10) || 0,
      limit: Math.min(parseInt(query.limit, 10) || this.readDefaultLimit, this.readMaxLimit),
      filter: this.parseConditions(query),
      sort: this.filterFields(query.sort, Filters.SORT) || '-_id',
      select: this.filterFields(query.select, Filters.SELECT) || this._selectable.join(' ')
    };
  },

  /**
   *
   *
   * @method parseConditions
   * @param {Object} query
   * @return {Object}
   */
  parseConditions: function(query) {
    return this._conditionsParser.compute(query);
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

  /**
   *
   *
   *
   * @returns {{statusCode: number}}
   */
  getDefaultPackage: function() {
    return {
      statusCode: NOOT.HTTP.OK
    };
  }

});


module.exports = Stack;