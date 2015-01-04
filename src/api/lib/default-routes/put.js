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
  path: '/:id',

  allowMany: true,

  init: function() {
    if (this.allowMany) this.path += '?';
    this._super();
  },

  handler: function(stack) {
    return stack.req.param('id') ? stack.update(stack) : stack.updateMany(stack);
  }

});

/**
 * @exports
 */
module.exports = Put;