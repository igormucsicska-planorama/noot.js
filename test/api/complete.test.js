var NOOT = nootrequire('api', 'mongoose', 'errors', 'http');
var mongoose = require('mongoose');
var express = require('express');
var supertest = require('supertest');
var _ = require('lodash');
var async = require('async');
var Utils = require('../test-utils');
var http = require('http');
var qs = require('querystring');


var API = NOOT.API;
var Route = NOOT.API.Route;
var Resource = NOOT.API.Resource;

var Schema = NOOT.Mongoose.Schema.extend({
  options: {
    versionKey: false,
    strict: true
  }
});


var db;

var app = express();
app.use(require('body-parser')());
app.use(function(err, req, res, next) {
  return res.status(err.statusCode || 500).json({ message: err.message, code: err.code, error: true });
});


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
    email: { type: String, required: true, unique: true },
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




describe('NOOT.API - Complete test', function() {

  before(function(done) {
    db = Utils.DB.create({ drop: true, name: 'noot-api-test' }, function() {
      User = db.model('User', UserSchema);
      Blog = db.model('Blog', BlogSchema);
      Post = db.model('Post', PostSchema);


      UserGetInfoRoute = Route.extend({
        method: 'get',
        path: '/:id?/info',
        handler: function(req, res, next) {
          var self = this;
          req.query = { select: 'name.first, name.last, age, -_id' };
          return this.resource.get(req, function(err, data) {
            if (err) return next(err);
            return self.resource.createResponse(res, data);
          });
        }
      });

      var UserRegisterRoute = Route.extend({
        method: 'post',
        path: '/register',
        handler: function(req, res, next) {
          var resource = this.resource;
          return resource.model.create(req.body, function(err, created) {
            if (err) return next(new NOOT.Errors.MongooseError(err));
            return resource.createResponse(res, {
              data: resource.filterFields(created, Resource.READ)
            }, NOOT.HTTP.Created);
          });
        }
      });


      UserResource = Resource.extend({
        model: User,
        routes: [UserRegisterRoute, UserGetInfoRoute],
        methods: ['get', 'patch', 'delete']
      });

      privateAPI = API.create({
        name: 'private',
        server: app
      });

      privateAPI.registerResource(UserResource);

      privateAPI.launch();

      return done();
    });
  });


  var me;
  var her;
  var him;

  before(function(done) {
    console.log(_.pluck(app._router.stack, 'route'));
    return http.createServer(app).listen(8788, done);
  });

  it('should create 3 users', function(done) {
    me = { name: { first: 'Sylvain', last: 'Estevez' }, age: 28, password: 'youllnotfind', email: 'se@nootjs.com' };
    her = { name: { first: 'Jane', last: 'Doe' }, password: 'youllnotfind', email: 'janedoe@nootjs.com' };
    him = { name: { first: 'John', last: 'Estevez' }, password: 'youllnotfind', email: 'johndoe@nootjs.com' };

    return async.each([me, her, him], function(item, cb) {
      return supertest(app)
        .post('/private/users/register')
        .send(item)
        .expect(201, cb);
    }, done);
  });

  it('should not create user (duplicate email)', function(done) {
    return supertest(app)
      .post('/private/users/register')
      .send(me)
      .expect(409, function(err, res) {
        return done();
      });
  });

  it('should find 3 users', function(done) {
    return supertest(app)
      .get('/private/users')
      .expect(200, function(err, res) {
        if (err) return done(err);
        res.body.data.should.have.lengthOf(3);
        res.body.meta.total.should.eql(3);
        return done();
      });
  });

  it('should retrieve each user by firstName', function(done) {
    return async.each([me, her, him], function(item, cb) {
      return supertest(app)
        .get('/private/users?' + qs.stringify({ 'name.first': item.name.first }))
        .expect(200)
        .end(function(err, res) {
          if (err) return cb(err);
          var body = res.body.data[0];
          body.name.first.should.eql(item.name.first);
          body.name.last.should.eql(item.name.last);
          body.email.should.eql(item.email);
          return cb();
        });
    }, done);
  });

  it('should retrieve each user by id', function(done) {
    return async.each([me, her, him], function(item, cb) {
      return User.findOne({ email: item.email }, '_id', function(err, user) {
        if (err) return done(err);
        return supertest(app)
          .get('/private/users/' + user._id)
          .expect(200)
          .end(function(err, res) {
            if (err) return cb(err);
            var body = res.body.data;
            body.name.first.should.eql(item.name.first);
            body.name.last.should.eql(item.name.last);
            body.email.should.eql(item.email);
            return cb();
          });
      });
    }, done);
  });

  it('should retrieve user info', function(done) {
    return User.findOne({ email: 'se@nootjs.com' }, '_id name', function(err, user) {
      if (err) return done(err);
      return supertest(app)
        .get('/private/users/' + user._id + '/info')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          var body = res.body.data;
          body.should.have.keys(['name', 'age']);
          body.name.first.should.eql(user.name.first);
          body.name.last.should.eql(user.name.last);
          return done();
        });
    });
  });

  it('should update user', function(done) {
    return User.findOne({ email: 'janedoe@nootjs.com' }, '_id', function(err, user) {
      if (err) return done(err);
      return supertest(app)
        .patch('/private/users/' + user._id)
        .send({ age: 25 })
        .expect(204, done);
    });
  });

  it('should update user', function(done) {
    return User.findOne({ email: 'johndoe@nootjs.com' }, '_id', function(err, user) {
      if (err) return done(err);
      return supertest(app)
        .patch('/private/users/' + user._id)
        .send({ age: 25 })
        .expect(204, done);
    });
  });

  //it('should retrieve users info', function(done) {
  //  return supertest(app)
  //    .get('/private/users/info?' + qs.stringify({ 'age__gt': 25 }))
  //    .expect(200)
  //    .end(function(err, res) {
  //      if (err) return done(err);
  //      var body = res.body.data;
  //      console.log(body);
  //      body.should.have.keys(['name', 'age']);
  //      body.name.first.should.eql(user.name.first);
  //      body.name.last.should.eql(user.name.last);
  //      return done();
  //    });
  //});




});