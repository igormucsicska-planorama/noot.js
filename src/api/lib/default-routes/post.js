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

  handler: function(req, res, next) {
    var self = this;
    return this.resource.post(req, function(err, data) {
      if (err) return next(err);
      return self.resource.createResponse(res, data);
    });
  }

});

/**
 * @exports
 */
module.exports = Post;