var Utils = require('../../test-utils');
var NOOT = nootrequire('api');
var express = require('express');
var async = require('async');
var supertest = require('supertest');
var http = require('http');
var bodyParser = require('body-parser');
var QS = require('querystring');


var db;
var app = express();
var server;
app.use(bodyParser());


/**
 * Testing tools
 */
var context = { test: NOOT.noop };

var test = function(options, fn, done) {
  if (arguments.length < 3) {
    done = fn;
    fn = options;
    options = {};
  }

  context.test = fn;
  options.method = options.method || 'get';

  var req = supertest(app)[options.method]('/stack' + (options.qs ? '?' + QS.stringify(options.qs) : ''));
  if (options.body) req.send(options.body);
  return req.expect(204, done);
};

var createStack = function(req, res, next) {
  req.stack = NOOT.API.Stack.create({
    __queryableParent: {},
    req: req,
    res: res,
    selectable: ['a', 'b', 'c'],
    writable: ['a', 'b', 'c'],
    sortable: ['a', 'b', 'c'],
    filterable: ['a', 'b', 'c']
  });
  return next();
};

var dynamicMiddleware = function(req, res, next) {
  return context.test(req, res, next);
};

app.get('/stack', createStack, dynamicMiddleware);
app.post('/stack', createStack, dynamicMiddleware);


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

  describe('.create()', function() {
    it('should have created a Stack', function(done) {
      test(function(req, res) {
        (req.stack instanceof NOOT.API.Stack).should.eql(true);
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.parseQueryString()', function() {
    it('`query` should have default values', function(done) {
      test(function(req, res) {
        var stack = req.stack;
        stack.parseQueryString();
        var query = stack.query;
        query.limit.should.eql(0);
        query.offset.should.eql(0);
        query.filter.should.deep.eql({});
        query.select.should.deep.eql(['a', 'b', 'c']);
        query.sort.should.deep.eql([]);
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.setStatus()', function() {
    it('should set right status', function(done) {
      test(function(req, res) {
        var stack = req.stack;
        stack.setStatus(200);
        stack.statusCode.should.eql(200);
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.setData()', function() {
    it('should set package.data', function(done) {
      test(function(req, res) {
        var foo = { bar: 'baz' };
        var stack = req.stack;
        stack.setData(foo);
        stack.package.data.should.eql(foo);
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.pushData()', function() {
    it('should push to package.data', function(done) {
      test(function(req, res) {
        var foo = { bar: 'baz' };
        var stack = req.stack;
        stack.pushData(foo);
        stack.package.data.should.deep.eql([foo]);
        return res.sendStatus(204);
      }, done);
    });
    it('should push to package.data (package.data is not an array)', function(done) {
      test(function(req, res) {
        var foo = { bar: 'baz' };
        var stack = req.stack;
        stack.setData({ foo: 'bar' });
        stack.pushData(foo);
        stack.package.data.should.deep.eql([{ foo: 'bar' }, foo]);
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.setMeta()', function() {
    it('should set package.meta', function(done) {
      test(function(req, res) {
        var foo = { bar: 'baz' };
        var stack = req.stack;
        stack.setMeta(foo);
        stack.package.meta.should.eql(foo);
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.appendMeta()', function() {
    it('should append to package.data', function(done) {
      test(function(req, res) {
        var foo = { bar: 'baz' };
        var stack = req.stack;
        stack.appendMeta('foo', foo);
        stack.package.meta.should.deep.eql({ foo: { bar: 'baz' } });
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.extendMeta()', function() {
    it('should extend package.data', function(done) {
      test(function(req, res) {
        var foo = { bar: 'baz' };
        var stack = req.stack;
        stack.extendMeta(foo);
        stack.package.meta.should.deep.eql({ bar: 'baz' });
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.extend()', function() {
    it('should push to package.data', function(done) {
      test(function(req, res) {
        var foo = { bar: 'baz' };
        var stack = req.stack;
        stack.extend(foo);
        stack.package.should.contain.key('bar');
        stack.package.bar.should.eql('baz');
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.createManyMeta()', function() {
    it('should push to package.data', function(done) {
      test(function(req, res) {
        var foo = { bar: 'baz' };
        var stack = req.stack;
        stack.extend(foo);

        stack.package.should.contain.key('bar');
        stack.package.bar.should.eql('baz');
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.getManyMetaNavLinks()', function() {

  });

  describe('.prototype.getManyMetaNavLink()', function() {
    it('should build a simple link from original query', function(done) {
      test(function(req, res) {
        var stack = req.stack;
        stack.parseQueryString();
        stack.getManyMetaNavLink(20, 0).should.eql('/stack?limit=20&offset=0');
        return res.sendStatus(204);
      }, done);
    });
    it('should build a simple link from original query', function(done) {
      test({ qs: { foo: 'bar' } }, function(req, res) {
        var stack = req.stack;
        stack.parseQueryString();
        stack.getManyMetaNavLink(20, 0).should.eql('/stack?foo=bar&limit=20&offset=0');
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.pushMessage()', function() {

  });

  describe('.prototype.setMessages()', function() {

  });

  describe('.prototype.addSelectable()', function() {

  });

  describe('.prototype.addFilterable()', function() {

  });

  describe('.prototype.addSortable()', function() {

  });

  describe('.prototype.addWritable()', function() {

  });

  describe('.prototype.removeSelectable()', function() {

  });

  describe('.prototype.removeFilterable()', function() {

  });

  describe('.prototype.removeSortable()', function() {

  });

  describe('.prototype.removeWritable()', function() {

  });

  describe('.prototype.setSelectable()', function() {

  });

  describe('.prototype.setFilterable()', function() {

  });

  describe('.prototype.setSortable()', function() {

  });

  describe('.prototype.setWritable()', function() {

  });

  describe('.prototype.getInvalidProperties()', function() {

  });

  describe('.prototype.filterProperties()', function() {

  });

  describe('.prototype.parseFieldsList()', function() {

  });

  describe('.prototype._addAllowedFieldsForType()', function() {

  });

  describe('.prototype._removeAllowedFieldsForType()', function() {

  });

  describe('.prototype._setAllowedFieldsForType()', function() {

  });

});