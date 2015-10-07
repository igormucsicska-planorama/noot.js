/**
 * Dependencies
 */
var NOOT = require('../../../../../index')();

var Field = require('./../lib/field');

/***********************************************************************************************************************
 * String field class.
 *
 * @class String
 * @namespace NOOT.API.Fields
 * @extends NOOT.API.Field
 * @constructor
 **********************************************************************************************************************/
var StringField = Field.extend({

  /**
   * @property supportedOperators
   * @type Array of String
   * @default ['eq', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'ne', 'regex']
   */
  supportedOperators: ['eq', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'ne', 'regex'],

  /**
   * Checks if value is a valid string
   *
   * @method validate
   * @param {*} value
   * @return {Boolean}
   */
  validate: function(value) {
    if (!this._super(value)) return false;
    return NOOT.isNull(value) || NOOT.isString(value);
  }

});

/**
 * @exports
 */
module.exports = StringField;