var NOOT = nootrequire('api');
var express = require('express');
var mongoose = require('mongoose');
var http  = require('http');
var supertest = require('supertest');
var async = require('async');
var _ = require('lodash');
var bodyParser = require('body-parser');
var loremIpsum = require('lorem-ipsum');
var qs = require('querystring');
var Utils = require('../test-utils');


/**
 * Database
 */
var db;

/**
 * Setup express app
 */
var app = express();
app.use(bodyParser());

/**
 * Create APIs
 */
var apiV1 = NOOT.API.create({
  version: 'v1',
  server: app
});

/**
 * Create models
 */
var User;
var Blog;
var Post;

/**
 * Create resources
 */
var BlogResource;
var UserResource;
var PostResource;


var fetchedData = { User: [], Blog: [], Post: [] };


describe('NOOT.API', function() {

  before(function(done) {
    return http.createServer(app).listen(8770, done);
  });

  before(function(done) {
    db = Utils.DB.create({ name: 'noot-api-test', drop: true }, function(err) {
      if (err) return done(err);

      /**
       * Create models
       */
      User = db.model('User', new mongoose.Schema({
        name: {
          first: String,
          last: String
        },
        email: String,
        password: String,
        blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog', default: function() { return []; } }]
      }, {
        collection: 'users'
      }));


      Blog = db.model('Blog', new mongoose.Schema({
        name: { type: String, required: true }
      }, {
        collection: 'blogs'
      }));


      Post = db.model('Post', new mongoose.Schema({
        message: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true }
      }, {
        collection: 'posts'
      }));

      /**
       * Create resources
       */
      BlogResource = NOOT.API.Resource.create({
        model: Blog
      });

      UserResource = NOOT.API.Resource.create({
        model: User,
        nonSelectable: ['password'],
        nonSortable: ['blogs']
      });

      PostResource = NOOT.API.Resource.create({
        model: Post,
        defaultLimit: 10,
        maxLimit: 50
      });


      apiV1
        .registerResources(PostResource, UserResource, BlogResource)
        .launch();

      return done();
    });
  });



  it('should create a blog', function(done) {
    return supertest(app)
      .post('/v1/blogs')
      .send({ name: 'MyFirstBlog' })
      .expect(201, function(err) {
        if (err) return done(err);
        return Blog.findOne(function(err, blog) {
          if (err) return done(err);
          blog.name.should.eql('MyFirstBlog');
          fetchedData.Blog.push(blog);
          return done();
        });
      });
  });

  it('should create a user', function(done) {
    return supertest(app)
      .post('/v1/users')
      .send({ 'name.first': 'John', 'name.last': 'Doe', email: 'john-doe@nootjs.com' })
      .expect(201, function(err) {
        if (err) return done(err);
        return User.findOne(function(err, user) {
          if (err) return done(err);
          user.name.should.be.an('object');
          user.name.first.should.eql('John');
          user.name.last.should.eql('Doe');
          user.email.should.eql('john-doe@nootjs.com');
          fetchedData.User.push(user);
          return done();
        });
      });
  });


  it('should create a post', function(done) {
    return supertest(app)
      .post('/v1/posts')
      .send({ user: fetchedData.User[0]._id, blog: fetchedData.Blog[0]._id, message: 'Hi, Im there' })
      .expect(201, function(err) {
        if (err) return done(err);
        return Post.findOne(function(err, post) {
          if (err) return done(err);
          post.message.should.eql('Hi, Im there');
          post.user.should.eql(fetchedData.User[0]._id);
          post.blog.should.eql(fetchedData.Blog[0]._id);
          fetchedData.Post.push(post);
          return done();
        });
      });
  });

  it('should create another user', function(done) {
    return supertest(app)
      .post('/v1/users')
      .send({ 'name.first': 'Jane', 'name.last': 'Doe', email: 'jane-doe@nootjs.com' })
      .expect(201, function(err) {
        if (err) return done(err);
        return User.findOne({ 'name.first': 'Jane' }, function(err, user) {
          if (err) return done(err);
          user.name.should.be.an('object');
          user.name.first.should.eql('Jane');
          user.name.last.should.eql('Doe');
          user.email.should.eql('jane-doe@nootjs.com');
          fetchedData.User.push(user);
          return done();
        });
      });
  });

  it('should update a user', function(done) {
    var userId  =fetchedData.User[0]._id;
    return supertest(app)
      .patch('/v1/users/' + userId)
      .send({ 'name.first': 'Mister' })
      .expect(204, function(err) {
        if (err) return done(err);
        return User.findById(userId, function(err, user) {
          if (err) return done(err);
          user.name.first.should.eql('Mister');
          fetchedData.User[0] = user;
          return done();
        });
      });
  });

  it('should create multiple posts', function(done) {
    return async.each([fetchedData.User[0]._id, fetchedData.User[1]._id], function(userId, userDone) {
      return async.times(100, function(index, cb) {
        return supertest(app)
          .post('/v1/posts')
          .send({ user: userId, blog: fetchedData.Blog[0]._id, message: loremIpsum() })
          .expect(201, function(err, res) {
            if (err) return cb(err);
            return Post.findOne({ _id: res.body.data._id }, function(err, post) {
              if (err) return cb(err);
              fetchedData.Post.push(post);
              return cb();
            });
          });
      }, userDone);
    }, done);
  });

  it('should remove a post', function(done) {
    var post = fetchedData.Post.shift();
    return supertest(app)
      .delete('/v1/posts/' + post._id)
      .expect(204, function(err) {
        if (err) return done(err);
        return Post.findOne({ _id: post._id }, function(err, item) {
          if (err) return done(err);
          should.not.exist(item);
          return done();
        });
      });
  });

  it('should retrieve a single post', function(done) {
    var post = fetchedData.Post[0].toObject();
    return supertest(app)
      .get('/v1/posts/' + post._id)
      .expect(200, function(err, res) {
        if (err) return done(err);
        var data = res.body.data;
        data.message.should.eql(post.message);
        data.blog.should.eql(post.blog.toString());
        data.user.should.eql(post.user.toString());
        return done();
      });
  });

  it('should retrieve multiple posts (filter on user)', function(done) {
    var userId = fetchedData.User[0]._id.toString();
    return supertest(app)
      .get('/v1/posts?' + qs.stringify({ user: userId }))
      .expect(200, function(err, res) {
        if (err) return done(err);
        var meta = res.body.meta;
        var data = res.body.data;
        meta.total.should.equal(100);
        meta.limit.should.equal(PostResource.defaultLimit);
        meta.offset.should.eql(0);
        data.should.be.an('array').and.have.lengthOf(PostResource.defaultLimit);
        data[0].should.contain.keys(['message', 'user', 'blog']);
        data.forEach(function(post) {
          post.user.should.eql(userId);
        });
        return done();
      });
  });

  it('should retrieve multiple posts (limit=30)', function(done) {
    return supertest(app)
      .get('/v1/posts?' + qs.stringify({ limit: 30 }))
      .expect(200, function(err, res) {
        if (err) return done(err);
        var meta = res.body.meta;
        var data = res.body.data;
        meta.total.should.equal(200);
        meta.limit.should.equal(30);
        meta.offset.should.eql(0);
        data.should.be.an('array').and.have.lengthOf(30);
        return done();
      });
  });

  it('should retrieve all posts', function(done) {
    var posts = [];
    var nextQuery = null;
    return async.doWhilst(function(cb) {
      return supertest(app)
        .get(nextQuery || ('/v1/posts?' + qs.stringify({ limit: 30, select: '_id,id' })))
        .expect(200, function(err, res) {
          if (err) return cb(err);
          var meta = res.body.meta;
          var data = res.body.data;
          meta.total.should.equal(200);
          meta.limit.should.equal(30);
          nextQuery = meta.next;
          data.should.be.an('array');
          posts = posts.concat(data);
          return cb();
        });
    }, function() {
      return nextQuery;
    }, function(err) {
      if (err) return done(err);
      posts.should.have.lengthOf(200);
      return Post.find({}, '_id')
        .sort('-_id')
        .exec(function(err, inDB) {
          if (err) return done(err);
          // Check default sorting on _id
          inDB.map(function(item) {
            return item._id.toString();
          }).should.deep.eql(posts.map(function(post) {
            return post._id;
          }));
          return done();
        });
    });
  });


});