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
  path: '/:id',

  allowMany: true,

  init: function() {
    if (this.allowMany) this.path += '?';
    this._super();
  },

  handler: function(stack) {
    return stack.req.param('id') ? stack.read(stack) : stack.readMany(stack);
  }

});

/**
 * @exports
 */
module.exports = Get;