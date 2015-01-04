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
  path: '/:id',

  allowMany: true,

  init: function() {
    if (this.allowMany) this.path += '?';
    this._super();
  },

  /**
   * @property handler
   * @type middleware
   */
  handler: function(stack) {
    return stack.req.param('id') ? stack.delete(stack) : stack.deleteMany(stack);
  }

});

/**
 * @exports
 */
module.exports = Delete;