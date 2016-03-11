/**
 * Dependencies
 */
var Route = require('../route');
var NOOT = require('../../../../index')('errors');

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
  handler: function(stack, callback) {
    var id = stack.params.id;

    if (!id) {
      if (!this.resource.allowMassDelete) return (callback || stack.next)(new NOOT.Errors.NotFound());
      return this.resource.deleteMany(stack, callback);
    }

    stack.primaryKey = id;
    return this.resource.delete(stack, callback);
  }

});

/**
 * @exports
 */
module.exports = Delete;
