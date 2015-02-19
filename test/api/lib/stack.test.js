var Utils = require('../../test-utils');
var NOOT = nootrequire('api');
var _ = require('lodash');
var express = require('express');
var async = require('async');
var supertest = require('supertest');
var http = require('http');
var bodyParser = require('body-parser');


var db;
var app = express();
var server;
app.use(bodyParser());


describe('NOOT.API.Stack', function() {

  before(function(done) {
    return async.series({
      db: function(cb) {
        db = Utils.DB.create({ drop: true, name: 'noot-api-stack' }, cb);
      },
      server: function(cb) {
        server = http.createServer(app).listen(8888, cb);
      }
    }, done);
  });

  before(function() {
    var createStack = function(req, res, next) {
      req.nootApiStack = NOOT.API.Stack.create({
        _queryableParent: {},
        req: req,
        res: res
      });
    };

    app.get('/test', createStack);
    app.post('/test', createStack);
  });


  describe('.create()', function() {

  });

});