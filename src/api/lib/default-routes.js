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
  Get: require('./default-routes/get'),
  Delete: require('./default-routes/delete'),
  Post: require('./default-routes/post'),
  Put: require('./default-routes/put'),
  Patch: require('./default-routes/patch')
});

/**
 * @exports
 */
module.exports = Routes;