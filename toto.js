var NOOT = require('noot')('api');
var express = require('express');
var mongoose = require('mongoose');

var app = express();

var apiV1 = NOOT.API.create({
  version: 'v1',
  server: app
});

var AuthRoute = NOOT.API.Route.extend({
  authHandler: function(req, res, next) {
    if (!req.user || req.user.level < this.level) return next(new NOOT.Errors.Unauthorized());
    return next();
  },
  init: function() {
    this._super();
    if (!NOOT.isNumber(this.level)) throw new Error('`AuthRoute`\'s `level` must be a number');
  }
});


var CustomRoute = AuthRoute.extend({
  path: '/users/me',
  handler: function(req, res, next) {
    var self = this;
    return this.resource.getSingle(req, function(err, data) {
      if (err) return next(err); // err can be a NOOT.Error
      return self.resource.createResponse(res, data, NOOT.HTTP.OK);
    });
  }
});

var UserResource = NOOT.API.Resource.extend({
  model: mongoose.model('User'),
  routes: [CustomRoute]
});

apiV1.registerResource(UserResource);

apiV1.launch();


