/**
 * Dependencies
 */
var NOOT = require('../../../')('object', 'errors');
var _ = require('lodash');

/***********************************************************************************************************************
 * @class ConditionsParser
 * @namespace NOOT.API
 * @extends NOOT.Object
 * @constructor
 **********************************************************************************************************************/
var ConditionsParser = NOOT.Object.extend({

  /**
   * @property fields
   * @type Array
   */
  fields: null,

  /**
   * @property operators
   * @type Array
   */
  operators: null,

  /**
   * @property shouldThrowOnInvalidOperator
   * @type Boolean
   * @default false
   */
  shouldThrowOnInvalidOperator: false,

  /**
   * @property shouldThrowOnInvalidField
   * @type Boolean
   * @default false
   */
  shouldThrowOnInvalidField: false,

  /**
   * Constructor
   */
  init: function() {
    NOOT.required(this, 'fields', 'operators');
  },

  /**
   *
   *
   *
   * @method compute
   * @param {Object} query
   * @returns {Object}
   */
  compute: function(query) {
    var self = this;

    var allowedFields = this.fields;
    var allowedOperators = this.operators;

    var shouldThrowField = this.shouldThrowOnInvalidField;
    var shouldThrowOperator = this.shouldThrowOnInvalidOperator;

    var ret = {};
    var map = [];

    var tmp = Object.keys(query).map(function(key) {
      var parts = key.split(/_{2,}/);
      return {
        path: parts.shift(),
        match: [{
          operator: parts[0] ? ('$' + parts[0]).replace(/^\${2,}/, '$$') : '$eq',
          value: query[key]
        }]
      };
    }).filter(function(key) {
      var isAllowed = !!~allowedFields.indexOf(key.path);
      if (shouldThrowField && !isAllowed) throw new NOOT.Errors.BadRequest('Invalid field: ' + key.path);
      return isAllowed;
    });

    var groupedByPath = _.groupBy(tmp, 'path');

    for (var path in groupedByPath) {
      map.push({
        path: path,
        match: _.flatten(groupedByPath[path].map(function(item) { return item.match; })).filter(function(match) {
          var isAllowed = !!~allowedOperators.indexOf(match.operator);
          if (shouldThrowOperator && !isAllowed) {
            throw new NOOT.Errors.BadRequest('Invalid operator: ' + match.operator);
          }
          return isAllowed;
        })
      });
    }

    map.forEach(function(key) {
      var equality = _.find(key.match, { operator: '$eq' });
      if (equality) {
        ret[key.path] = equality.value;
      } else {
        key.match.forEach(function(match) {
          ret[key.path] = ret[key.path] || {};
          ret[key.path][match.operator] = self.parseMatch(match);
        });
      }
    });

    return ret;
  },

  /**
   *
   *
   *
   * @method parseMatch
   * @param {Object} match
   * @return {*}
   */
  parseMatch: function(match) {
    switch (match.operator) {
      case '$in':
      case '$nin':
        return (match.value).toString().split(/\s*,\s*/);
      default: return match.value;
    }
  }

});


module.exports = ConditionsParser;