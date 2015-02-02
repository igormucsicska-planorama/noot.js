/**
 * Dependencies
 */
var Route = require('../route');

/***********************************************************************************************************************
 * @class Patch
 * @namespace NOOT.API.DefaultRoutes
 * @extends NOOT.API.Route
 * @constructor
 *
 **********************************************************************************************************************/
var Patch = Route.extend({

  method: 'patch',
  path: '/',

  handler: function(stack) {
    return this.resource.update(stack);
  }

});

/**
 * @exports
 */
module.exports = Patch;