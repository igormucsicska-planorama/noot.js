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

  handler: function(stack) {
    return this.resource.create(stack);
  }

});

/**
 * @exports
 */
module.exports = Post;