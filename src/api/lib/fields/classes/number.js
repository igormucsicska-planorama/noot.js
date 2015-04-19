/**
 * Dependencies
 */
var NOOT = require('../../../../../index')();

var Field = require('./../lib/field');

/***********************************************************************************************************************
 * Number field class.
 *
 * @class Number
 * @namespace NOOT.API.Fields
 * @constructor
 * @extends NOOT.API.Field
 **********************************************************************************************************************/
var NumberField = Field.extend({

  /**
   * @property supportedOperators
   * @type Array of String
   * @default ['eq', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'ne']
   */
  supportedOperators: ['eq', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'ne'],

  /**
   * Turns a string into a number.
   *
   * @method parseFromQueryString
   * @param {String} value
   * @return {Number}
   */
  parseFromQueryString: function(value) {
    return parseFloat(value);
  },

  /**
   * Checks if value is a number. Also calls `_super()`.
   *
   * @param {*} value
   * @returns {Boolean}
   */
  validate: function(value) {
    if (!this._super(value)) return false;
    return !isNaN(value) && NOOT.isNumber(value);
  }
});

/**
 * @exports
 */
module.exports = NumberField;