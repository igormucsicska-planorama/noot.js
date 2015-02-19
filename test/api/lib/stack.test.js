var Utils = require('../../test-utils');
var NOOT = nootrequire('api');
var express = require('express');
var async = require('async');
var supertest = require('supertest');
var http = require('http');
var bodyParser = require('body-parser');


var db;
var app = express();
var server;
app.use(bodyParser());
var context = { test: NOOT.noop };


describe('NOOT.API.Stack', function() {


  before(function() {
    var createStack = function(req, res, next) {
      req.stack = NOOT.API.Stack.create({
        __queryableParent: {},
        req: req,
        res: res,
        selectable: ['a', 'b', 'c']
      });
      return next();
    };

    var testMiddleware = function(req, res, next) {
      return context.test(req, res, next);
    };

    app.get('/stack', createStack, testMiddleware);
    app.post('/stack', createStack, testMiddleware);
  });

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

  describe('.create()', function() {

    it('should have created a Stack', function(done) {
      context.test = function(req, res) {
        (req.stack instanceof NOOT.API.Stack).should.eql(true);
        return res.sendStatus(204);
      };

      return supertest(app)
        .get('/stack')
        .expect(204, done);
    });

  });

  describe('.prototype.parseQueryString()', function() {

    it('`query` should have default values', function(done) {
      context.test = function(req, res) {
        var stack = req.stack;
        stack.parseQueryString();
        var query = stack.query;
        query.limit.should.eql(0);
        query.offset.should.eql(0);
        query.filter.should.deep.eql({});
        query.select.should.deep.eql(['a', 'b', 'c']);
        query.sort.should.deep.eql([]);
        return res.sendStatus(204);
      };

      return supertest(app)
        .get('/stack?')
        .expect(204, done);
    });

  });

  describe('.prototype.setStatus()', function() {});
  describe('.prototype.setData()', function() {});
  describe('.prototype.pushData()', function() {});
  describe('.prototype.setMeta()', function() {});
  describe('.prototype.appendMeta()', function() {});
  describe('.prototype.extendMeta()', function() {});
  describe('.prototype.append()', function() {});
  describe('.prototype.createManyMeta()', function() {});
  describe('.prototype.getManyMetaNavLinks()', function() {});
  describe('.prototype.getManyMetaNavLink()', function() {});
  describe('.prototype.pushMessage()', function() {});
  describe('.prototype.setMessages()', function() {});
  describe('.prototype.addSelectable()', function() {});
  describe('.prototype.addFilterable()', function() {});
  describe('.prototype.addSortable()', function() {});
  describe('.prototype.addWritable()', function() {});
  describe('.prototype.removeSelectable()', function() {});
  describe('.prototype.removeFilterable()', function() {});
  describe('.prototype.removeSortable()', function() {});
  describe('.prototype.removeWritable()', function() {});
  describe('.prototype.setSelectable()', function() {});
  describe('.prototype.setFilterable()', function() {});
  describe('.prototype.setSortable()', function() {});
  describe('.prototype.setWritable()', function() {});
  describe('.prototype.getInvalidProperties()', function() {});
  describe('.prototype.filterProperties()', function() {});
  describe('.prototype.parseFieldsList()', function() {});
  describe('.prototype._addAllowedFieldsForType()', function() {});
  describe('.prototype._removeAllowedFieldsForType()', function() {});
  describe('.prototype._setAllowedFieldsForType()', function() {});



});