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
  isDetailable: true,

  handler: function(stack) {
    var id = stack.params.id;
    if (id) stack.primaryKey = id;
    return id ? this.resource.get(stack) : this.resource.getMany(stack);
  }

});

/**
 * @exports
 */
module.exports = Get;