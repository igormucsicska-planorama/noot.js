/**
 * Dependencies
 */
var NOOT = require('../../../')('errors', 'http');
var Inflector = require('inflected');
var _ = require('lodash');

var Utils = require('./utils');
var QueryModes = require('./query-modes');
var QueryMode = require('./query-mode');

/**
 * Defaults values for bubbled properties
 */
var DEFAULTS = {
  _readDefaultLimit: 20,
  _readMaxLimit: 100,
  _updateMaxLimit: 20,
  _writeMaxLimit: 20,
  _deleteMaxLimit: 20,
  get __selectable() { return []; },
  get __writable() { return []; },
  get __sortable() { return []; },
  get __filterable() { return []; }
};


/***********************************************************************************************************************
 * @class Queryable
 * @namespace NOOT.API
 * @static
 **********************************************************************************************************************/
var Queryable = {

  /**
   * @property _queryableParent
   * @type Object
   * @private
   */
  _queryableParent: null,


  shouldAlwaysSendData: false,
  get _shouldAlwaysSendData() { return this._bubbleProperty('shouldAlwaysSendData', '_shouldAlwaysSendData'); },

  /**
   *
   */
  _readMaxLimit: null,
  set readMaxLimit(value) { this._readMaxLimit = value; },
  get readMaxLimit() { return this._bubbleProperty('_readMaxLimit', 'readMaxLimit'); },

  _readDefaultLimit: null,
  set readDefaultLimit(value) { this._readDefaultLimit = value; },
  get readDefaultLimit() { return this._bubbleProperty('_readDefaultLimit', 'readDefaultLimit'); },

  _updateMaxLimit: null,
  set updateMaxLimit(value) { this._updateMaxLimit = value; },
  get updateMaxLimit() { return this._bubbleProperty('_updateMaxLimit', 'updateMaxLimit'); },

  _writeMaxLimit: null,
  set writeMaxLimit(value) { this._writeMaxLimit = value; },
  get writeMaxLimit() { return this._bubbleProperty('_writeMaxLimit', 'writeMaxLimit'); },

  _deleteMaxLimit: null,
  set deleteMaxLimit(value) { this._deleteMaxLimit = value; },
  get deleteMaxLimit() { return this._bubbleProperty('_deleteMaxLimit', 'deleteMaxLimit'); },

  selectable: null,
  nonSelectable: null,
  __selectable: null,
  get _selectable() { return this._bubbleProperty('__selectable', '_selectable'); },

  writable: null,
  nonWritable: null,
  __writable: null,
  get _writable() { return this._bubbleProperty('__writable', '_writable'); },

  sortable: null,
  nonSortable: null,
  __sortable: null,
  get _sortable() { return this._bubbleProperty('__sortable', '_sortable'); },

  filterable: null,
  nonFilterable: null,
  __filterable: null,
  get _filterable() { return this._bubbleProperty('__filterable', '_filterable'); },


  /**
   *
   *
   * @method create
   * @async
   * @param {NOOT.API.Stack} stack
   * @param {Function} [callback]
   */
  create: function(stack, callback) {
    if (NOOT.isArray(stack.body)) return this.createMany(stack, callback);

    var self = this;

    return this.model.create(stack.body, function(err, item) {
      if (err) return (callback || stack.next)(NOOT.Errors.fromMongoose(err));
      item = self.filterFields(item, QueryModes.READ);
      return callback ? callback(null, item) : stack.status(NOOT.HTTP.Created).data(item).next();
    });
  },

  /**
   *
   *
   * @method createMany
   * @async
   * @param {NOOT.API.Stack} stack
   * @param {Function} [callback]
   */
  createMany: function(stack, callback) {
    var self = this;

    return this.model.create(stack.body, function(err, items) {
      if (err) return (callback || stack.next)(NOOT.Errors.fromMongoose(err));
      items = items.map(function(item) { return self.filterFields(item, QueryModes.READ); });
      return callback ? callback(null, items) : stack.status(NOOT.HTTP.Created).data(items).next();
    });
  },

  /**
   *
   *
   * @method read
   * @async
   * @param {NOOT.API.Stack} stack
   * @param {Function} [callback]
   */
  read: function(stack, callback) {
    var self = this;

    return this.model
      .findById(this.parseId(stack))
      .select(stack.query.select)
      .exec(function(err, item) {
        if (err) return (callback || stack.next)(NOOT.Errors.fromMongoose(err));
        if (!item) return (callback || stack.next)(new NOOT.Errors.NotFound());
        item = self.filterFields(item, QueryModes.READ);
        return callback ? callback(null, item) : stack.status(NOOT.HTTP.OK).data(item).next();
      });
  },

  /**
   *
   *
   * @method readMany
   * @async
   * @param {NOOT.API.Stack} stack
   * @param {Function} [callback]
   */
  readMany: function(stack, callback) {
    var self = this;
    var query = stack.query;

    return this.model
      .find(query.filter)
      .select(query.select)
      .sort(query.sort)
      .skip(query.offset)
      .limit(query.limit)
      .exec(function(err, items) {
        if (err) return (callback || stack.next)(NOOT.Errors.fromMongoose(err));
        items = items.map(function(item) { return self.filterFields(item, QueryModes.READ); });
        if (callback) return callback(null, items);
        return self.getCount(query.filter, function(err, count) {
          if (err) return stack.next(err);
          return stack.status(NOOT.HTTP.OK).data(items).meta(stack.getMeta(count)).next();
        });
      });
  },

  /**
   *
   *
   * @method update
   * @async
   * @param {NOOT.API.Stack} stack
   * @param {Function} [callback]
   */
  update: function(stack, callback) {
    if (NOOT.isArray(stack.body)) return this.updateMany(stack, callback);

    var self = this;
    var shouldSendData = this._shouldAlwaysSendData;
    var method = shouldSendData ? 'update' : 'findOneAndUpdate';
    var methodArgs = [{ _id: this.parseId(stack) }, { $set: this.filterFields(stack.body, QueryModes.WRITE) }];
    if (shouldSendData) methodArgs.push({ select: stack.query.select, new: true });

    return this.model[method].apply(this.model, methodArgs.concat(function(err, updated) {
      if (err) return (callback || stack.next)(NOOT.Errors.fromMongoose(err));
      if (!updated) return (callback || stack.next)(new NOOT.Errors.NotFound());
      if (shouldSendData) updated = self.filterFields(updated, QueryModes.READ);
      if (callback) return callback(null, updated);
      if (shouldSendData) stack.status(NOOT.HTTP.OK).data(updated);
      else stack.status(NOOT.HTTP.NoContent);
      return stack.next();
    }));
  },

  /**
   *
   *
   * @method updateMany
   * @async
   * @param {NOOT.API.Stack} stack
   * @param {Function} [callback]
   */
  updateMany: function(stack, callback) {
    var self = this;
    var shouldSendData = this._shouldAlwaysSendData;

    var performUpdate = function(onUpdated) {
      return self.model.update(stack.query.filter, { $set: stack.body }, { multi: true }, onUpdated);
    };

    if (shouldSendData) {
      return this.model.distinct('_id', stack.query.filter, function(err, ids) {
        if (err) return (callback || stack.next)(NOOT.Errors.fromMongoose(err));
        return performUpdate(function(err) {
          if (err) return (callback || stack.next)(NOOT.Errors.fromMongoose(err));
          return self.model.find({ _id: { $in: ids } }, stack.query.select, function(err, items) {
            if (err) return (callback || stack.next)(NOOT.Errors.fromMongoose(err));
            items = items.map(function(item) { return self.filterFields(item, QueryModes.READ); });
            if (callback) return callback(null, items);
            return stack.status(NOOT.HTTP.OK).data(items).next();
          });
        });
      });
    } else {
      return performUpdate(function(err, updated) {
        if (err) return (callback || stack.next)(NOOT.Errors.fromMongoose(err));
        if (callback) return callback(null, updated);
        return stack.status(NOOT.HTTP.NoContent).next();
      });
    }

  },

  /**
   *
   *
   * @method delete
   * @async
   * @param {NOOT.API.Stack} stack
   * @param {Function} [callback]
   */
  delete: function(stack, callback) {
    var self = this;
    var id = this.parseId(stack);
    var shouldSendData = this._shouldAlwaysSendData;
    var method = shouldSendData ? 'remove' : 'findByIdAndRemove';
    var methodArgs = shouldSendData ? [{ _id: id }] : [id, { select: stack.query.select }];
    return this.model[method].apply(this.model, methodArgs.concat(function (err, removed) {
      if (err) return (callback || stack.next)(NOOT.Errors.fromMongoose(err));
      if (!removed) return (callback || stack.next)(new NOOT.Errors.NotFound());
      if (shouldSendData) removed = self.filterFields(removed, QueryModes.READ);
      if (callback) return callback(null, removed);
      if (shouldSendData) stack.status(NOOT.HTTP.OK).data(removed);
      else stack.status(NOOT.HTTP.NoContent);
      return stack.next();
    }));
  },

  /**
   *
   *
   * @method deleteMany
   * @async
   * @param {NOOT.API.Stack} stack
   * @param {Function} [callback]
   */
  deleteMany: function(stack, callback) {
    var self = this;
    var shouldSendData = this._shouldAlwaysSendData;
    var method = shouldSendData ? 'remove' : 'findAndModify';
    var methodArgs = [stack.query.filter];
    if (shouldSendData) methodArgs.push({ remove: true, select: stack.query.select, sort: stack.query.sort });

    return this.model[method].apply(this.model, methodArgs.concat(function(err, removed) {
      if (err) return (callback || stack.next)(NOOT.Errors.fromMongoose(err));
      if (shouldSendData) removed = removed.map(function(item) { return self.filterFields(item, QueryModes.READ); });
      if (callback) return callback(null, removed);
      if (shouldSendData) stack.status(NOOT.HTTP.OK).data(removed);
      else stack.status(NOOT.HTTP.NoContent);
      return stack.next();
    }));
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
      case QueryModes.READ: return NOOT.pickProperties(fields, this._selectable);
      case QueryModes.SELECT: return this.parseFieldsList(fields, this._selectable);
      case QueryModes.WRITE: return NOOT.pickProperties(fields, this._writable);
      case QueryModes.FILTER: return _.pick(fields, this._filterable);
      case QueryModes.SORT: return this.parseFieldsList(fields, this._sortable);
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
   * @method getCount
   * @async
   * @param {Object} filter
   * @param {Function} callback
   */
  getCount: function(filter, callback) {
    return this.model.count(filter, callback);
  },

  /**
   *
   * @method parseId
   * @param {NOOT.API.Stack} stack
   * @return {String|null}
   */
  parseId: function(stack) {
    var req = stack.req;
    return req.param(stack.idKey, req.param('id', req.param('_id', null)));
  },


  /**
   *
   *
   * @method _computeQueryable
   * @private
   */
  _computeQueryable: function() {
    this._buildFields();
  },

  /**
   * Get an exhaustive list of paths for model (nested paths use dot notation)
   *
   * @method _getModelPaths
   * @return {Array}
   * @private
   */
  _getModelPaths: function() {
    return Object.keys(this.model.schema.paths);
  },

  /**
   * Build allowed fields for all types
   *
   * @method _buildFields
   * @private
   */
  _buildFields: function() {
    // IMPORTANT 'selectable' has to be computed first
    this._buildFieldsForType('selectable');
    // Build the other types
    ['sortable', 'writable', 'filterable'].forEach(this._buildFieldsForType.bind(this));
  },

  /**
   * Build allowed fields for a single type
   *
   * @method _buildFieldsForType
   * @param {String} type
   * @private
   */
  _buildFieldsForType: function(type) {
    var allowed = this[type];
    var disallowed = this['non' + Inflector.classify(type)];
    if (!allowed && !this._queryableParent) allowed = this._getModelPaths();
    if (disallowed) {
      if (!allowed) allowed = this._getModelPaths();
      allowed = allowed.filter(function(field) { return !~disallowed.indexOf(field); });
    }

    if (type === 'selectable') {
      if (allowed) {
        var allAllowed = [];

        allowed.forEach(function(item) {
          var parts = item.split('.');
          var tmp = parts.shift();
          allAllowed.push(tmp);
          parts.forEach(function(part) {
            tmp += '.' + part;
            allAllowed.push(tmp);
          });
        });

        allowed = allAllowed;
      }
    } else {
      // Security : ensure that
      if (allowed || !this._queryableParent) { // Force definition for highest parent
        allowed = _.intersection(this._selectable, allowed);
      }
    }

    this['__' + type] = allowed;
  },

  /**
   *
   *
   * @method _bubbleProperty
   * @param {String} propertyName
   * @param {String} bubblingKey
   * @return {*}
   * @private
   */
  _bubbleProperty: function(propertyName, bubblingKey) {
    return Utils.bubbleProperty(this, '_queryableParent', propertyName, {
      default: DEFAULTS[propertyName],
      bubblingKey: bubblingKey
    });
  }

};


module.exports = Queryable;
