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
module.exports = Patch;