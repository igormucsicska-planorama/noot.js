/**
 * Dependencies
 */
var NOOT = require('../../')('namespace');
var Registerable = require('./lib/registerable');

/***********************************************************************************************************************
 * @class Mixins
 * @extends NOOT.Namespace
 * @static
 * @namespace NOOT
 * @uses NOOT.Mixins.Registerable
 **********************************************************************************************************************/
var Mixins = NOOT.Namespace.extend(Registerable).create({
  Registerable: Registerable
});

/**
 * @exports
 */
module.exports = Mixins;