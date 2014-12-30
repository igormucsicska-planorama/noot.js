/**
 * Dependencies
 */
var NOOT = require('../../../')('namespace');

/***********************************************************************************************************************
 * @class DefaultRoutes
 * @namespace NOOT.API
 * @extends NOOT.Namespace
 * @static
 **********************************************************************************************************************/
var Routes = NOOT.Namespace.create({
  get: require('./default-routes/get'),
  delete: require('./default-routes/delete'),
  post: require('./default-routes/post'),
  put: require('./default-routes/put'),
  patch: require('./default-routes/patch')
});

/**
 * @exports
 */
module.exports = Routes;