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
    var id = stack.req.param('id');
    if (id) stack.primaryKey = id;
    return id ? this.resource.get(stack) : this.resource.getMany(stack);
  }

});

/**
 * @exports
 */
module.exports = Get;