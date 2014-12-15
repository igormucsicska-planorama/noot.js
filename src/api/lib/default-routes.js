/**
 * Dependencies
 */
var NOOT = require('../../../')('namespace');
var Route = require('./route');

/***********************************************************************************************************************
 * DefaultRoutes
 ***********************************************************************************************************************
 *
 * @info configurations for default routes by verb
 *
 *
 **********************************************************************************************************************/
var Routes = NOOT.Namespace.create({
  get: Route.extend({ path: '/:id?', method: 'get' }, { defaultHandler: 'read' }),
  delete: Route.extend({ path: '/:id', method: 'delete' }, { defaultHandler: 'delete' }),
  post: Route.extend({ path: '/', method: 'post' }, { defaultHandler: 'create' }),
  put: Route.extend({ path: '/:id', method: 'put' }, { defaultHandler: 'update' }),
  patch: Route.extend({ path: '/:id', method: 'patch' }, { defaultHandler: 'update' })
});

/**
 * @module
 */
module.exports = Routes;