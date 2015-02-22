/**
 * Dependencies
 */
var NumberField = require('./number');

/***********************************************************************************************************************
 * Integer field class
 *
 * @class Integer
 * @namespace NOOT.API.Fields
 * @extends NOOT.API.Fields.Number
 * @constructor
 **********************************************************************************************************************/
var IntegerField = NumberField.extend({

  /**
   * Turns a string into an integer.
   *
   * @method parseFromQueryString
   * @param {String} value
   * @return {Number}
   */
  parseFromQueryString: function(value) {
    return parseInt(value, 10);
  }

});

/**
 * @exports
 */
module.exports = IntegerField;