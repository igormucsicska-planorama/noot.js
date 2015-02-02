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

  allowMany: true,

  handler: function(stack) {
    return stack.update(stack);
  }

});

/**
 * @exports
 */
module.exports = Put;