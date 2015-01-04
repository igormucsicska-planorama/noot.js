/**
 * Dependencies
 */
var _ = require('lodash');

var Utils = {};

/**
 * Attach other libraries
 */
['common', 'types', 'case', 'validation'].forEach(function(file) {
  _.extend(Utils, require('./lib/' + file));
});


module.exports = Utils;