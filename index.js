var NOOT = require('./lib/noot');
var NOOTUtils = require('./lib/noot/utils');
var _ = require('lodash');

module.exports = function() {
  return _.extend({}, NOOT, NOOTUtils, NOOT.require.apply(NOOT, arguments));
};