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
 * @extends NOOT.API.Field
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
   * @return {Date|NaN}
   */
  parseFromQueryString: function(value) {
    return value ?
      this.isTimestamp(value) ? new Date(parseInt(value, 10)) : new Date(Date.parse(value)) :
      NaN;
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
    return NOOT.isValidDate(value);
  }
});

/**
 * Dependencies
 */
module.exports = DateField;