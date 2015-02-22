/**
 * Dependencies
 */
var NOOT = require('../../../../../index')();

var Field = require('./../lib/field');

/***********************************************************************************************************************
 * Date field class.
 *
 * @class Date
 * @namespace NOOT.API.Fields
 * @constructor
 **********************************************************************************************************************/
var DateField = Field.extend({

  /**
   * @property supportedOperators
   * @type Array of String
   * @default ['eq', 'gt', 'gte', 'lt', 'lte']
   */
  supportedOperators: ['eq', 'gt', 'gte', 'lt', 'lte'],

  /**
   * Turns a string into a date. String can be a timestamp or any format supported by `Date.parse()`.
   *
   * @method parseFromQueryString
   * @param {String} value
   * @return {Date}
   */
  parseFromQueryString: function(value) {
    return this.isTimestamp(value) ? new Date(value) : Date.parse(value);
  },

  /**
   * Checks if parameter string can represent a timestamp. 
   *
   * @method isTimestamp
   * @param {String} value
   * @return {Boolean}
   */
  isTimestamp: function(value) {
    return !!(value && /^\d+$/.test(value.toString()));
  },

  /**
   * Checks if parameter is a valid date. Also calls `_super()`.
   *
   * @method validate
   * @param {*} value
   * @return {Boolean}
   */
  validate: function(value) {
    if (!this._super(value)) return false;
    return !NOOT.isDate(value);
  }
});

/**
 * Dependencies
 */
module.exports = DateField;