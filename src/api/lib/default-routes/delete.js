/**
 * Dependencies
 */
var Route = require('../route');

/***********************************************************************************************************************
 * @class Delete
 * @namespace NOOT.API.DefaultRoutes
 * @extends NOOT.API.Route
 * @constructor
 **********************************************************************************************************************/
var Delete = Route.extend({

  /**
   * @property method
   * @default delete
   * @type String
   */
  method: 'delete',

  /**
   * @property path
   * @default /:id
   * @type String
   */
  path: '/',

  isDetailable: true,

  /**
   * @property handler
   * @type middleware
   */
  handler: function(stack) {
    var id = stack.params.id;
    if (id) stack.primaryKey = id;
    return id ? this.resource.delete(stack) : this.resource.deleteMany(stack);
  }

});

/**
 * @exports
 */
module.exports = Delete;