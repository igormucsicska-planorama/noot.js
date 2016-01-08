var express = require('express');
var http = require('http');
var NOOT = nootrequire('api', 'mongoose');
var supertest = require('supertest');
var _ = require('lodash');
var async = require('async');
var Utils = require('../test-utils');
var bodyParser = require('body-parser');
var qs = require('querystring');

var db;
var app = express();
var server;
app.use(bodyParser());

var testConfigList = [
  { method: 'POST', data: { name: 'John Doe', age: 45, phone: '123-456-7890' } },
  { method: 'POST', data: { age: 45, phone: '123-456-7890' }, validationError: true },
  { method: 'POST', data: { name: 'John Doe', age: 200, phone: '123-456-7890' }, validationError: true },
  { method: 'POST', data: { name: 'John Doe', age: -20, phone: '123-456-7890' }, validationError: true },
  { method: 'POST', data: { name: 'John Doe', age: 45, phone: '123-4569-7890' }, validationError: true },
  { method: 'PUT', data: { name: 'John Doe', age: 45, phone: '123-456-7890' } },
  { method: 'PUT', data: { name: null, age: 45, phone: '123-456-7890' }, validationError: true },
  { method: 'PUT', data: { name: 'John Doe', age: 200, phone: '123-456-7890' }, validationError: true },
  { method: 'PUT', data: { name: 'John Doe', age: -20, phone: '123-456-7890' }, validationError: true },
  { method: 'PUT', data: { name: 'John Doe', age: 45, phone: '123-4569-7890' }, validationError: true },
  { method: 'PATCH', data: { name: 'John Doe', age: 45, phone: '123-456-7890' } },
  { method: 'PATCH', data: { name: null }, validationError: true },
  { method: 'PATCH', data: { age: 200 }, validationError: true },
  { method: 'PATCH', data: { age: -20 }, validationError: true },
  { method: 'PATCH', data: { phone: '123-4569-7890' }, validationError: true }
];
var testUser;

describe('NOOT.API - Validation', function() {

  before(function(done) {
    return async.series({
      db: function(cb) {
        db = Utils.DB.create({ drop: true, name: 'noot-api-validation-test' }, cb);
      },
      server: function(cb) {
        server = http.createServer(app).listen(8688, cb);
      }
    }, done);
  });

  before(function(done) {

    var User = db.model('User', NOOT.Mongoose.Schema.extend({
      schema: {
        name: { type: String, required: true },
        age: { type: Number, min: 0, max: 150 },
        phone: {
          type: String,
          validate: {
            validator: function(v) {
              return /\d{3}-\d{3}-\d{4}/.test(v);
            },
            message: '{VALUE} is not a valid phone number!'
          }
        }
      }
    }));

    var UserResource = NOOT.API.MongooseResource.extend({ model: User });

    return async.series({
      db: function (cb) {
        User.create({ name: 'John Doe', age: 45, phone: '123-456-7890' }, function(err, data) {
          if (err) return cb(err);
          testUser = data.toObject();
          return cb();
        });
      },
      server: function (cb) {
        NOOT.API.create({ name: 'my-api', server: app })
          .registerResource('User', UserResource)
          .launch();

        return cb();
      }
    }, done);
  });

  testConfigList.forEach(function(testConfig) {
    var desc = !testConfig.validationError ?
      'should succeed if all data is valid' :
      'should not succeed if any data is not valid';

    describe(testConfig.method + ' routes', function() {
      it(desc, function(done) {
        var method = testConfig.method.toLowerCase();
        var routes = {
          post: {
            status: 201,
            url: '/my-api/users',
            data: testConfig.data
          },
          put: {
            status: 204,
            url: '/my-api/users?' + qs.stringify({ _id: testUser._id.toString() }),
            data: _.extend(_.omit(testUser, ['__v', '_id']), testConfig.data)
          },
          patch: {
            status: 204,
            url: '/my-api/users/' + testUser._id,
            data: testConfig.data
          }
        };

        return supertest(app)
          [method](routes[method].url)
          .send(routes[method].data)
          .expect(testConfig.validationError ? 400 : routes[method].status, function(err, res) {
            if (err) return done(err);

            if (!testConfig.validationError) {
              if (method === 'post') {
                res.body.data.should.to.exist;
              }
            } else {
              res.body.error.should.to.be.true;
              res.body.messages[0].should.to.contain('ValidationError');

            }

            return done();
          });
      });
    });
  });

  after(function(done) {
    server.close(done);
  });

});