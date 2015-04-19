/**
 * Dependencies
 */
var NOOT = require('../../../../../')();

var Field = require('../lib/field');

/***********************************************************************************************************************
 * Boolean field class.
 *
 * @class Boolean
 * @namespace NOOT.API.Fields
 * @extends NOOT.API.Field
 * @constructor
 **********************************************************************************************************************/
var BooleanField = Field.extend({

  /**
   * @property supportedOperators
   * @type Array of String
   * @default ['eq', 'ne']
   */
  supportedOperators: ['eq', 'ne'],

  /**
   * Turns "true" into `true` and any other value into `false`
   *
   * @method parseFromQueryString
   * @param {String} value
   * @returns {Boolean}
   */
  parseFromQueryString: function(value) {
    return value === 'true';
  },

  /**
   * Checks if value is a boolean. Also calls `_super()`.
   *
   * @method validate
   * @param {*} value
   * @return {Boolean}
   */
  validate: function(value) {
    return this._super(value) && NOOT.isBoolean(value);
  }

});

module.exports = BooleanField;