/**
 * Dependencies
 */
var Route = require('../route');

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
  isDetailable: false,

  handler: function(stack, callback) {
    return this.resource.create(stack, callback);
  }

});

/**
 * @exports
 */
module.exports = Post;