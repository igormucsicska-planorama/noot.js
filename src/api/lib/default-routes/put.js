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

  handler: function(stack, callback) {
    return this.resource.upsert(stack, callback);
  }

});

/**
 * @exports
 */
module.exports = Put;