var express = require('express');
var http = require('http');
var NOOT = nootrequire('api', 'mongoose');
var supertest = require('supertest');
var _ = require('lodash');
var async = require('async');
var Utils = require('../test-utils');
var bodyParser = require('body-parser');
var qs = require('querystring');
var mongoose = require('mongoose');

var db;
var app = express();
var server;
app.use(bodyParser());


var users = [
  { firstName: 'John', lastName: 'Doe', email: 'john-doe@nootjs.com', random: 12, ca: 123 },
  { firstName: 'Jane', lastName: 'Doe', email: 'jane-doe@nootjs.com', random: ['12'] },
  { firstName: 'Bart', lastName: 'Doe', email: 'bart-doe@nootjs.com', random: '12' },
  { firstName: 'Homer', lastName: 'Doe', email: 'homer-doe@nootjs.com' }
];


describe('NOOT.API - Basic example', function() {

  before(function(done) {
    return async.series({
      db: function(cb) {
        db = Utils.DB.create({ drop: true, name: 'noot-api-basic-example' }, cb);
      },
      server: function(cb) {
        server = http.createServer(app).listen(18888, cb);
      }
    }, done);
  });

  before(function() {

    var User = db.model('User', NOOT.Mongoose.Schema.extend({
      schema: {
        firstName: String,
        lastName: String,
        email: { type: String, required: true, unique: true },
        random: mongoose.Schema.Types.Mixed,
        ca: Number
      }
    }));

    var UserResource = NOOT.API.MongooseResource.extend({ model: User });

    NOOT.API.create({ name: 'my-api', server: app })
      .registerResource('User', UserResource)
      .launch();

  });

  it('should have created routes for resource', function() {
    var routes = _.compact(app._router.stack.map(function(item) { return item.route; }));

    (_.find(routes, { methods: { delete: true }, path: '/my-api/users/:id' })).should.not.eql(undefined);
    (_.find(routes, { methods: { get: true }, path: '/my-api/users/:id' })).should.not.eql(undefined);
    (_.find(routes, { methods: { patch: true }, path: '/my-api/users/:id' })).should.not.eql(undefined);
    (_.find(routes, { methods: { delete: true }, path: '/my-api/users' })).should.not.eql(undefined);
    (_.find(routes, { methods: { get: true }, path: '/my-api/users' })).should.not.eql(undefined);
    (_.find(routes, { methods: { patch: true }, path: '/my-api/users' })).should.not.eql(undefined);
    (_.find(routes, { methods: { put: true }, path: '/my-api/users' })).should.not.eql(undefined);
    (_.find(routes, { methods: { post: true }, path: '/my-api/users' })).should.not.eql(undefined);

    (_.find(routes, { methods: { put: true }, path: '/my-api/users/:id' }) === undefined).should.eql(true);
    (_.find(routes, { methods: { post: true }, path: '/my-api/users/:id' }) === undefined).should.eql(true);
  });

  it('should create a single user', function(done) {
    supertest(app)
      .post('/my-api/users')
      .send(users[0])
      .expect(201, function(err) {
        if (err) return done(err);
        return db.model('User').count(function(err, count) {
          if (err) return done(err);
          count.should.eql(1);
          return done();
        });
      });
  });

  it('should create multiple users', function(done) {
    supertest(app)
      .post('/my-api/users')
      .send(users.slice(1))
      .expect(201, function(err, res) {
        if (err) return done(err);
        res.body.data.length.should.equal(users.slice(1).length);
        return db.model('User').find(function(err, items) {
          if (err) return done(err);
          items.length.should.eql(4);
          items.forEach(function(item) {
            item = item.toJSON();
            var original = _.find(users, _.pick(item, 'email'));
            _.pick(item, Object.keys(original)).should.deep.eql(original);
          });
          return done();
        });
      });
  });

  it('should not create a user (duplicate email)', function(done) {
    supertest(app)
      .post('/my-api/users')
      .send(users[0])
      .expect(409, done);
  });

  it('should find a user by id', function(done) {
    return db.model('User').findOne(function(err, user) {
      if (err) return done(err);
      return supertest(app)
        .get('/my-api/users/' + user._id)
        .expect(200, function(err, res) {
          if (err) return done(err);
          res.body.data.email.should.eql(user.email);
          return done();
        });
    });
  });

  it('should find a user by id with a correct query string', function(done) {
    return db.model('User').findOne({ ca: 123 }, function(err, user) {
      if (err) return done(err);
      return supertest(app)
        .get('/my-api/users/' + user._id + '?' + qs.stringify({ ca: 123 }))
        .expect(200, function(err, res) {
          if (err) return done(err);
          res.body.data.email.should.eql(user.email);
          return done();
        });
    });
  });

  it('should not find a user by id with a wrong query string', function(done) {
    return db.model('User').findOne({ ca: 123 }, function(err, user) {
      if (err) return done(err);
      return supertest(app)
        .get('/my-api/users/' + user._id + '?' + qs.stringify({ ca: 124 }))
        .expect(404, done);
    });
  });

  it('should get users by lastName', function(done) {
    return supertest(app)
      .get('/my-api/users?' + qs.stringify({ lastName: 'Doe' }))
      .expect(200, function(err, res) {
        if (err) return done(err);
        res.body.meta.total.should.eql(4);
        res.body.data.length.should.eql(4);
        _.every(res.body.data, function(item) {
          return item.lastName === 'Doe';
        }).should.eql(true);
        return done();
      });
  });

  it('should order users by firstName', function(done) {
    return supertest(app)
      .get('/my-api/users?' + qs.stringify({ sort: 'firstName' }))
      .expect(200, function(err, res) {
        if (err) return done(err);
        res.body.meta.total.should.eql(4);
        var data = res.body.data;
        data.length.should.eql(4);
        data[0].firstName.should.eql('Bart');
        data[1].firstName.should.eql('Homer');
        data[2].firstName.should.eql('Jane');
        data[3].firstName.should.eql('John');
        return done();
      });
  });

  it('should include only firstName and lastName', function(done) {
    return supertest(app)
      .get('/my-api/users?' + qs.stringify({ select: 'firstName, lastName' }))
      .expect(200, function(err, res) {
        if (err) return done(err);
        res.body.meta.total.should.eql(4);
        var data = res.body.data;
        data.length.should.eql(4);
        data.forEach(function(item) {
          item.should.have.keys(['_id', 'firstName', 'lastName']);
        });
        return done();
      });
  });

  it('should update user\'s firstName', function(done) {
    return db.model('User').findOne(function(err, user) {
      if (err) return done(err);
      return supertest(app)
        .patch('/my-api/users/' + user._id)
        .send({ firstName: 'Randall' })
        .expect(204, function(err) {
          if (err) return done(err);
          return db.model('User').findById(user._id, function(err, user) {
            if (err) return done(err);
            user.firstName.should.eql('Randall');
            return done();
          });
        });
    });
  });

  it('should delete a user', function(done) {
    return db.model('User').findOne(function(err, user) {
      if (err) return done(err);
      return supertest(app)
        .delete('/my-api/users/' + user._id)
        .expect(204, function(err) {
          if (err) return done(err);
          return db.model('User').findById(user._id, function(err, user) {
            if (err) return done(err);
            (user === null).should.eql(true);
            return done();
          });
        });
    });
  });

  after(function(done) {
    server.close(done);
  });

});
