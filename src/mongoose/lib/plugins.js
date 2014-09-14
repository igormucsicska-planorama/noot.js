/**
 * Dependencies
 */
var mongooseTypes = require('mongoose-types');
var NOOT = require('../../../')('namespace');


var Plugins = NOOT.Namespace.create({
  useTimestamps: mongooseTypes.useTimestamps
});

/**
 * @module
 */
module.exports = Plugins;
