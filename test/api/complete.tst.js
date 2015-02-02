var NOOT = nootrequire('api', 'mongoose', 'errors', 'http');
var mongoose = require('mongoose');
var express = require('express');
var supertest = require('supertest');
var async = require('async');
var Utils = require('../test-utils');
var http = require('http');
var qs = require('querystring');


var API = NOOT.API;
var Route = NOOT.API.Route;
var MongooseResource = NOOT.API.MongooseResource;

var Schema = NOOT.Mongoose.Schema.extend({
  options: {
    versionKey: false,
    strict: true
  }
});


var db;

var app = express();
app.use(require('body-parser')());

var UserSchema;
var BlogSchema;
var UserPostSchema;

var User;
var Blog;
var UserPost;

var privateAPI;

var UserResource;
var UserPostResource;

var UserGetInfoRoute;
var UserGetInfoFromStackRoute;


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

UserPostSchema = Schema.extend({
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
      UserPost = db.model('UserPost', UserPostSchema);

      //UserGetInfoRoute = Route.extend({
      //  method: 'get',
      //  isDetail: true,
      //  path: '/info',
      //  handler: function(stack) {
      //    return this.resource.get(stack);
      //  }
      //});
      //
      //UserGetInfoFromStackRoute = Route.extend({
      //  method: 'get',
      //  isDetail: true,
      //  path: '/info-from-stack'
      //
      //});
      //
      //

      var UserRegisterRoute = Route.extend({
        method: 'post',
        path: '/register',
        nonWritable: ['blogs', '_id'],
        handlers: [
          function(stack) {
            stack.addWritable('password');
            return stack.next();
          },
          function(stack) {
            return this.resource.create(stack);
          }
        ]
      });

      UserResource = MongooseResource.extend({
        model: User,
        methods: ['get', 'patch', 'delete', 'post'],
        nonSelectable: ['password'],
        routes: [UserRegisterRoute]
      });

      UserPostResource = MongooseResource.extend({
        model: UserPost,
        manyMethods: ['get']
      });

      privateAPI = API.create({
        name: 'private',
        server: app
      });

      privateAPI.registerResources({
        User: UserResource,
        UserPost: UserPostResource
      });

      privateAPI.launch();

      return done();
    });
  });


  var me;
  var her;
  var him;

  before(function(done) {
    return http.createServer(app).listen(8788, done);
  });

  it('should create 3 users', function(done) {
    me = { name: { first: 'Sylvain', last: 'Estevez' }, age: 28, password: 'youllnotfind', email: 'se@nootjs.com' };
    her = { name: { first: 'Jane', last: 'Doe' }, password: 'youllnotfind', email: 'janedoe@nootjs.com' };
    him = { name: { first: 'John', last: 'Estevez' }, password: 'youllnotfind', email: 'johndoe@nootjs.com' };

    return async.eachSeries([me, her, him], function(item, cb) {
      return supertest(app)
        .post('/private/users/register')
        .send(item)
        .expect(201, function(err, res) {
          if (err) return cb(err);
          var body = res.body.data;
          body.should.include.key('_id');
          body.name.should.deep.eql(item.name);
          body.email.should.eql(item.email);
          return cb();
        });
    }, done);
  });

  it('should not create user (duplicate email)', function(done) {
    return supertest(app)
      .post('/private/users/register')
      .send(me)
      .expect(409, done);
  });

  it('should find 3 users', function(done) {
    return supertest(app)
      .get('/private/users')
      .expect(200, function(err, res) {
        if (err) return done(err);
        res.body.data.should.have.lengthOf(3);
        var meta = res.body.meta;
        (meta.next === null).should.eql(true);
        (meta.prev === null).should.eql(true);
        meta.limit.should.eql(20);
        meta.total.should.eql(3);
        meta.offset.should.eql(0);
        return done();
      });
  });

  it('should retrieve each user by firstName', function(done) {
    return async.each([me, her, him], function(item, cb) {
      return supertest(app)
        .get('/private/users?' + qs.stringify({
          'name.first': item.name.first,
          select: 'name,email',
          age__gt: 1,
          age__lt: 100
        }))
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

  //it('should retrieve each user by id', function(done) {
  //  return async.each([me, her, him], function(item, cb) {
  //    return User.findOne({ email: item.email }, '_id', function(err, user) {
  //      if (err) return done(err);
  //      return supertest(app)
  //        .get('/private/users/' + user._id)
  //        .expect(200)
  //        .end(function(err, res) {
  //          if (err) return cb(err);
  //          var body = res.body.data;
  //          body.name.first.should.eql(item.name.first);
  //          body.name.last.should.eql(item.name.last);
  //          body.email.should.eql(item.email);
  //          return cb();
  //        });
  //    });
  //  }, done);
  //});
  //
  //it('should retrieve user info', function(done) {
  //  return User.findOne({ email: 'se@nootjs.com' }, '_id name', function(err, user) {
  //    if (err) return done(err);
  //    return supertest(app)
  //      .get('/private/users/' + user._id + '/info')
  //      .expect(200)
  //      .end(function(err, res) {
  //        if (err) return done(err);
  //        var body = res.body.data;
  //        body.should.have.keys(['name', 'email']);
  //        body.name.first.should.eql(user.name.first);
  //        body.name.last.should.eql(user.name.last);
  //        return done();
  //      });
  //  });
  //});
  //
  //it('should retrieve user info-from-stack', function(done) {
  //  return User.findOne({ email: 'se@nootjs.com' }, '_id name', function(err, user) {
  //    if (err) return done(err);
  //    return supertest(app)
  //      .get('/private/users/' + user._id + '/info-from-stack')
  //      .expect(200)
  //      .end(function(err, res) {
  //        if (err) return done(err);
  //        var body = res.body.data;
  //        body.should.have.keys(['name', 'email']);
  //        body.name.first.should.eql(user.name.first);
  //        body.name.last.should.eql(user.name.last);
  //        return done();
  //      });
  //  });
  //});
  //
  //
  //it('should update user', function(done) {
  //  return User.findOne({ email: 'janedoe@nootjs.com' }, '_id', function(err, user) {
  //    if (err) return done(err);
  //    return supertest(app)
  //      .patch('/private/users/' + user._id)
  //      .send({ age: 25 })
  //      .expect(204, function(err) {
  //        if (err) return done(err);
  //        return User.findOne({ email: 'janedoe@nootjs.com' }, 'age', function(err, user) {
  //          if (err) done(err);
  //          user.age.should.eql(25);
  //          return done();
  //        });
  //      });
  //  });
  //});
  //
  //it('should update user', function(done) {
  //  return supertest(app)
  //    .patch('/private/users?' + qs.stringify({ email: 'johndoe@nootjs.com' }))
  //    .send({ age: 23 })
  //    .expect(204, function(err) {
  //      if (err) return done(err);
  //      return User.findOne({ email: 'johndoe@nootjs.com' }, 'age', function(err, user) {
  //        if (err) done(err);
  //        user.age.should.eql(23);
  //        return done();
  //      });
  //    });
  //});
});