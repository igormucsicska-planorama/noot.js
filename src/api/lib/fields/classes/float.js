/**
 * Dependencies
 */
var NumberField = require('./number');

/***********************************************************************************************************************
 * Float field class.
 *
 * @class Float
 * @namespace NOOT.API.Fields
 * @constructor
 * @extends NOOT.API.Fields.Number
 **********************************************************************************************************************/
var FloatField = NumberField.extend({});

/**
 * @exports
 */
module.exports = FloatField;