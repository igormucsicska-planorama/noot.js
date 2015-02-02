/**
 * Dependencies
 */
var NOOT = require('../../../../')('namespace');

var Route = require('../route');

/***********************************************************************************************************************
 * @class DefaultRoutes
 * @namespace NOOT.API
 * @extends NOOT.Namespace
 * @static
 **********************************************************************************************************************/
var Routes = NOOT.Namespace.create({
  get: require('./get'),
  delete: require('./delete'),
  post: require('./post'),
  put: require('./put'),
  patch: require('./patch')
});

// List supported methods
Routes.supportedMethods = Object.keys(Routes).filter(function(property) {
  return Route.detect(Routes[property]);
});

/**
 * @exports
 */
module.exports = Routes;