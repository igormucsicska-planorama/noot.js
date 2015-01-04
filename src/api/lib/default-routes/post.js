/**
 * Dependencies
 */
var Route = require('../route');
var NOOT = require('../../../../')('errors');

/***********************************************************************************************************************
 * @class Post
 * @namespace NOOT.API.DefaultRoutes
 * @extends NOOT.API.Route
 * @constructor
 *
 **********************************************************************************************************************/
var Post = Route.extend({
  method: 'post',
  path: '/',

  allowMany: true,

  handler: function(stack) {
    if (!this.allowMany && NOOT.isArray(stack.body)) {
      return stack.next(new NOOT.Errors.Forbidden('Cannot post multiple items at a time'));
    }
    return stack.create(stack);
  }

});

/**
 * @exports
 */
module.exports = Post;