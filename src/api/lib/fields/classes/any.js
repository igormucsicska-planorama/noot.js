/**
 * Dependencies
 */
var Field = require('./../lib/field');

/***********************************************************************************************************************
 * Number field class.
 *
 * @class Number
 * @namespace NOOT.API.Fields
 * @constructor
 * @extends NOOT.API.Field
 **********************************************************************************************************************/
var AnyField = Field.extend({

  /**
   * @property supportedOperators
   * @type Array of String
   * @default ['eq', 'ne']
   */
  supportedOperators: ['eq', 'ne']
});

/**
 * @exports
 */
module.exports = AnyField;