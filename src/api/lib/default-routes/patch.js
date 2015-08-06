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
  isDetailable: true,

  handler: function(stack, callback) {
    var id = stack.params.id;
    if (id) stack.primaryKey = id;
    return id ? this.resource.update(stack, callback) : this.resource.updateMany(stack, callback);
  }

});

/**
 * @exports
 */
module.exports = Patch;