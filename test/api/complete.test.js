var NOOT = nootrequire('api', 'mongoose');
var mongoose = require('mongoose');
var express = require('express');
var supertest = require('supertest');
var _ = require('lodash');
var async = require('async');


var API = NOOT.API;
var Route = NOOT.API.Route;
var Resource = NOOT.API.Resource;
var Schema = NOOT.Mongoose.Schema.extend({
  options: {
    versionKey: false,
    strict: true
  }
});


var app = express();
app.use(require('body-parser'));

var UserSchema;
var BlogSchema;
var PostSchema;

var User;
var Blog;
var Post;

var privateAPI;
var publicAPI;

var UserResource;
var BlogResource;
var PostResource;

var UserGetInfoRoute;
var BlogGetPostsRoute;


UserSchema = Schema.extend({
  schema: {
    name: { first: String, last: String },
    age: Number,
    email: { type: String, required: true },
    password: { type: String, required: true },
    blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
  }
});

UserSchema.virtual('fullName').get(function() {
  return this.name.first + ' ' + this.name.last;
});

BlogSchema = Schema.extend({
  schema: {
    name: { type: String, required: true }
  }
});

PostSchema = Schema.extend({
  schema: {
    name: { type: String, required: true },
    content: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }
  }
});


User = mongoose.model('User', UserSchema);
Blog = mongoose.model('Blog', BlogSchema);
Post = mongoose.model('Post', PostSchema);


UserGetInfoRoute = Route.extend({
  method: 'get',
  path: '/:id/info',
  handler: function(req, res, next) {

  }
});

UserResource = Resource.extend({
  model: User
});


privateAPI = API.create({
  name: 'private',
  server: app
});

privateAPI.registerResource(UserResource);
privateAPI.launch();

describe('NOOT.API - Complete test', function() {




});