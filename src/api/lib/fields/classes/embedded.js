/**
 * Dependencies
 */
var Field = require('./../lib/field');

/***********************************************************************************************************************
 * Embedded field class.
 *
 * @class Number
 * @namespace NOOT.API.Fields
 * @constructor
 * @extends NOOT.API.Field
 **********************************************************************************************************************/
var EmbeddedField = Field.extend({

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
module.exports = EmbeddedField;
