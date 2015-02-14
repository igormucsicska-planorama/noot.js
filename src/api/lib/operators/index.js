/**
 * Dependencies
 */
var NOOT = require('../../../../')('namespace', 'mixins');
var fs = require('fs');
var path = require('path');

/**
 * Dynamically create the namespace
 */
var classes = {};
var classesDirectory = path.resolve(__dirname, './classes');
fs.readdirSync(classesDirectory).forEach(function(fileName) {
  classes[fileName.split('.')[0]] = require(path.join(classesDirectory, fileName));
});

/***********************************************************************************************************************
 * @class Operators
 * @static
 * @namespace NOOT.API
 * @uses NOOT.Mixins.Registerable
 **********************************************************************************************************************/
module.exports = NOOT.Namespace.extend(NOOT.Mixins.Registerable).create(classes);