var express = require('express');
var supertest = require('supertest');
var http = require('http');
var _ = require('lodash');

var app = express();

describe('Express', function() {
  it('should be right instances', function(done) {
    app.get('/instances', function(req, res) {
      req.should.be.an.instanceOf(http.IncomingMessage);
      res.should.be.an.instanceOf(http.ServerResponse);
      return res.send(200);
    });


    return supertest(app)
      .get('/instances')
      .expect(200, done);
  });
});