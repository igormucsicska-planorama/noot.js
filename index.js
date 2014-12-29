var NOOTManager = require('./src/noot/manager');
var NOOTUtils = require('./src/noot/utils');
var _ = require('lodash');

/**
 * @class NOOT
 * @static
 */
module.exports = function() {
  return _.extend({}, NOOTManager, NOOTUtils, NOOTManager.require.apply(NOOTManager, arguments));
};