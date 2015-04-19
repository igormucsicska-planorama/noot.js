/**
 * Dependencies
 */
var NOOT = require('../../../../')('namespace', 'mixins');
var fs = require('fs');
var path = require('path');
var Inflector = require('inflected');

/**
 * Dynamically create the namespace
 */
var classes = {};
var classesDirectory = path.resolve(__dirname, './classes');
fs.readdirSync(classesDirectory).forEach(function(fileName) {
  classes[Inflector.classify(fileName.split('.')[0])] = require(path.join(classesDirectory, fileName));
});

/***********************************************************************************************************************
 * Namespace for exposing NOOT.API.Field's.
 *
 * @class Fields
 * @uses NOOT.Mixins.Registerable
 * @namespace NOOT.API
 * @static
 * @extends NOOT.Namespace
 **********************************************************************************************************************/
module.exports = NOOT.Namespace.extend(NOOT.Mixins.Registerable).create(classes);