var NOOT = require('noot')('api');
var express = require('express');
var mongoose = require('mongoose');

var app = express();



var AuthRoute = NOOT.API.Route.extend({
  authorization: function(req, res, next) {
    if (req.user.level < this.level) return next(new NOOT.Errors.Unauthorized());
    return next();
  },

  init: function() {
    this._super();
    if (!NOOT.isNumber(this.level)) throw new Error('`AuthRoute`\'s `level` must be a number');
  }
});



var UserResource = NOOT.API.Resource.extend({
  model: mongoose.model('User'),
  customRoutes: [
    AuthRoute.extend({
      path: '/users/me',
      handler: function(stack) {
        stack.filter(['email', 'name']);

        stack.next();
      }
    })
  ]
});

var PostResource = NOOT.API.Resource.extend({
  model: mongoose.model('Post')
});

NOOT.API
  .create({ version: 'v1', server: app })
  .registerResources(UserResource, PostResource)
  .launch();


