/**
 * Dependencies
 */
var NOOT = require('../../../../../')();

var Resource = require('./resource');

/***********************************************************************************************************************
 * @class MongoResource
 * @namespace NOOT.API
 * @constructor
 * @extends NOOT.API.Resource
 **********************************************************************************************************************/
var MongoResource = Resource.extend({

  /**
   * Parses stack's filter to a MongoDB compatible one.
   *
   * @method parseQueryFilter
   * @param {NOOT.API.Stack} stack
   * @param {Function} [callback]
   */
  parseQueryFilter: function(stack, callback) {
    callback = callback || stack.next;

    return this._super(stack, function(err) {
      if (err) return callback(err);

      var filter = stack.query.filter;

      for (var path in filter) {
        var pathFilter = filter[path];
        if (NOOT.isPlainObject(pathFilter)) {
          for (var operator in pathFilter) {
            NOOT.renameProperty(pathFilter, operator, MongoResource.toMongoOperator(operator));
          }
        }
      }

      return callback();
    });
  },

  /**
   * Parses stack's select to a MongoDB compatible one.
   *
   * @method parseQuerySelect
   * @param {NOOT.API.Stack} stack
   * @param {Function} [callback]
   */
  parseQuerySelect: function(stack, callback) {
    var self = this;
    callback = callback || stack.next;
    this._super(stack, function(err) {
      if (err) return callback(err);
      stack.query.select = self.constructor.toMongoSelectOrSort(stack.query.select);
      return callback();
    });
  },

  /**
   * Parses stack's sort to a MongoDB compatible one.
   *
   * @method parseQuerySort
   * @param {NOOT.API.Stack} stack
   * @param {Function} [callback]
   */
  parseQuerySort: function(stack, callback) {
    var self = this;
    callback = callback || stack.next;
    this._super(stack, function(err) {
      if (err) return callback(err);
      stack.query.sort = self.constructor.toMongoSelectOrSort(stack.query.sort);
      return callback();
    });
  }

}, {

  /**
   * Transforms an array of property to a MongoDB compatible one.
   *
   * @method toMongoSelectOrSort
   * @param {Array} arr
   * @return {Object}
   * @static
   */
  toMongoSelectOrSort: function(arr) {
    var self = this;
    var ret = {};
    if (!arr) return ret;

    arr.forEach(function(fieldName) {
      var shouldExclude = fieldName[0] === self.EXCLUSION_CHARACTER;
      fieldName = fieldName.replace(new RegExp('^' + self.EXCLUSION_CHARACTER), '');
      ret[fieldName] = shouldExclude ? -1 : 1;
    });

    return ret;
  },

  /**
   * Transforms an operator to a MongoDB compatible one.
   *
   * @method toMongoOperator
   * @param {String} operator
   * @return {String}
   * @static
   */
  toMongoOperator: function(operator) {
    return '$' + operator;
  }

});

/**
 * @exports
 */
module.exports = MongoResource;