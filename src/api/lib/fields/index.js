/**
 * Dependencies
 */
var NOOT = require('../../../../index')('namespace');

/***********************************************************************************************************************
 * Namespace for exposing NOOT.API.Field's.
 *
 * @class Fields
 * @namespace NOOT.API
 * @static
 * @extends NOOT.Namespace
 **********************************************************************************************************************/
var Fields = NOOT.Namespace.create({
  Number: require('./fields/number'),
  Integer: require('./fields/integer'),
  Float: require('./fields/float'),
  String: require('./fields/string'),
  Date: require('./fields/date'),
  Boolean: require('./fields/boolean')
});

/**
 * @exports
 */
module.exports = Fields;