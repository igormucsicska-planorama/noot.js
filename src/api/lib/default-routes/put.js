/**
 * Dependencies
 */
var Route = require('../route');

/***********************************************************************************************************************
 * @class Put
 * @namespace NOOT.API.DefaultRoutes
 * @extends NOOT.API.Route
 * @constructor
 *
 **********************************************************************************************************************/
var Put = Route.extend({

  method: 'put',
  path: '/',

  isDetailable: false,

  handler: function(stack) {
    return this.resource.upsert(stack);
  }

});

/**
 * @exports
 */
module.exports = Put;