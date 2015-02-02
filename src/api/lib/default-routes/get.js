/**
 * Dependencies
 */
var Route = require('../route');

/***********************************************************************************************************************
 * @class Get
 * @namespace NOOT.API.DefaultRoutes
 * @extends NOOT.API.Route
 * @constructor
 *
 **********************************************************************************************************************/
var Get = Route.extend({

  method: 'get',
  path: '/',

  handler: function(stack) {
    return stack.req.param('id') ? this.resource.get(stack) : this.resource.getMany(stack);
  }

});

/**
 * @exports
 */
module.exports = Get;