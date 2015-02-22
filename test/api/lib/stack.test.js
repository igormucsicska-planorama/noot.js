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
    req: req,
    res: res,
    selectable: ['a', 'b', 'c'],
    writable: ['a', 'b', 'c'],
    sortable: ['a', 'b', 'c'],
    filterable: ['a', 'b', 'c'],
    maxGetLimit: 100,
    defaultGetLimit: 20
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
      return test(function(req, res) {
        (req.stack instanceof NOOT.API.Stack).should.eql(true);
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.parseQueryString()', function() {
    it('`query` should have default values', function(done) {
      return test(function(req, res) {
        var stack = req.stack;
        stack.parseQueryString();
        var query = stack.query;
        query.limit.should.eql(20);
        query.offset.should.eql(0);
        query.filter.should.deep.eql({});
        query.select.should.deep.eql(['a', 'b', 'c']);
        query.sort.should.deep.eql([]);
        return res.sendStatus(204);
      }, done);
    });
    it('should correctly parse limit (< maxGetLimit)', function(done) {
      return test({ qs: { limit: 5 } }, function(req, res) {
        var stack = req.stack;
        stack.parseQueryString();
        stack.query.limit.should.eql(5);
        return res.sendStatus(204);
      }, done);
    });
    it('should correctly parse limit (> maxGetLimit)', function(done) {
      return test({ qs: { limit: 105 } }, function(req, res) {
        var stack = req.stack;
        stack.parseQueryString();
        stack.query.limit.should.eql(100);
        return res.sendStatus(204);
      }, done);
    });
    it('should correctly parse limit (negative number)', function(done) {
      return test({ qs: { limit: -5 } }, function(req, res) {
        var stack = req.stack;
        stack.parseQueryString();
        stack.query.limit.should.eql(20);
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.setStatus()', function() {
    it('should set right status', function(done) {
      return test(function(req, res) {
        var stack = req.stack;
        stack.setStatus(200);
        stack.statusCode.should.eql(200);
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.setData()', function() {
    it('should set package.data', function(done) {
      return test(function(req, res) {
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
      return test(function(req, res) {
        var foo = { bar: 'baz' };
        var stack = req.stack;
        stack.pushData(foo);
        stack.package.data.should.deep.eql([foo]);
        return res.sendStatus(204);
      }, done);
    });
    it('should push to package.data (package.data is not an array)', function(done) {
      return test(function(req, res) {
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
      return test(function(req, res) {
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
      return test(function(req, res) {
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
      return test(function(req, res) {
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
      return test(function(req, res) {
        var foo = { bar: 'baz' };
        var stack = req.stack;
        stack.extend(foo);
        stack.package.should.contain.key('bar');
        stack.package.bar.should.eql('baz');
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.getManyMetaNavLink()', function() {
    it('should build a simple link from original query', function(done) {
      return test(function(req, res) {
        var stack = req.stack;
        stack.parseQueryString();
        stack.getManyMetaNavLink(20, 0).should.eql('/stack?limit=20&offset=0');
        return res.sendStatus(204);
      }, done);
    });
    it('should build a simple link from original query (including original querystring)', function(done) {
      return test({ qs: { foo: 'bar' } }, function(req, res) {
        var stack = req.stack;
        stack.parseQueryString();
        stack.getManyMetaNavLink(20, 0).should.eql('/stack?foo=bar&limit=20&offset=0');
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.getManyMetaNavLinks()', function() {
    it('should build next and prev links', function(done) {
      return test({ qs: { limit: 5, offset: 50 } }, function(req, res) {
        var stack = req.stack;
        stack.parseQueryString();
        stack.getManyMetaNavLinks(100).should.deep.eql({
          prev: '/stack?limit=5&offset=45',
          next: '/stack?limit=5&offset=55'
        });
        return res.sendStatus(204);
      }, done);
    });
    it('should build next link only', function(done) {
      return test({ qs: { limit: 5, offset: 3 } }, function(req, res) {
        var stack = req.stack;
        stack.parseQueryString();
        stack.getManyMetaNavLinks(100).should.deep.eql({
          prev: null,
          next: '/stack?limit=5&offset=8'
        });
        return res.sendStatus(204);
      }, done);
    });
    it('should build prev link only', function(done) {
      return test({ qs: { limit: 5, offset: 97 } }, function(req, res) {
        var stack = req.stack;
        stack.parseQueryString();
        stack.getManyMetaNavLinks(100).should.deep.eql({
          prev: '/stack?limit=5&offset=92',
          next: null
        });
        return res.sendStatus(204);
      }, done);
    });
    it('should build no links', function(done) {
      return test({ qs: { limit: 5, offset: 50 } }, function(req, res) {
        var stack = req.stack;
        stack.parseQueryString();
        stack.getManyMetaNavLinks(3).should.deep.eql({
          prev: null,
          next: null
        });
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.createManyMeta()', function() {
    it('should create manyMeta and attach it to package', function(done) {
      return test({ qs: { limit: 5, offset: 50 } }, function(req, res) {
        var stack = req.stack;
        stack.parseQueryString().createManyMeta(100);
        stack.package.meta.should.deep.eql({
          total: 100,
          limit: 5,
          offset: 50,
          prev: '/stack?limit=5&offset=45',
          next: '/stack?limit=5&offset=55'
        });
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.setMessages()', function() {
    it('should override package.messages', function(done) {
      return test(function(req, res) {
        var stack = req.stack;
        stack.setMessages(['A message']);
        stack.package.messages.should.deep.eql(['A message']);
        return res.sendStatus(204);
      }, done);
    });
    it('should create an array if argument isn\'t', function(done) {
      return test(function(req, res) {
        var stack = req.stack;
        stack.setMessages('A message');
        stack.package.messages.should.deep.eql(['A message']);
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.pushMessage()', function() {
    it('should push a new message', function(done) {
      return test(function(req, res) {
        var stack = req.stack;
        stack.setMessages(['A message']).pushMessage('Another message');
        stack.package.messages.should.deep.eql(['A message', 'Another message']);
        return res.sendStatus(204);
      }, done);
    });
    it('should create package.messages array if it does not exist', function(done) {
      return test(function(req, res) {
        var stack = req.stack;
        stack.pushMessage('Another message');
        stack.package.messages.should.deep.eql(['Another message']);
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype._addAllowedFieldsForType()', function() {
    it('should set selectable fields', function(done) {
      return test(function(req, res) {
        var stack = req.stack;
        stack._addAllowedFieldsForType('selectable', ['a', 'b', 'c', 'd']);
        stack.selectable.should.deep.eql(['a', 'b', 'c', 'd']);
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype._removeAllowedFieldsForType()', function() {
    it('should remove a selectable field', function(done) {
      return test(function(req, res) {
        var stack = req.stack;
        stack._removeAllowedFieldsForType('selectable', 'b');
        stack.selectable.should.deep.eql(['a', 'c']);
        return res.sendStatus(204);
      }, done);
    });
    it('should remove multiple selectable fields', function(done) {
      return test(function(req, res) {
        var stack = req.stack;
        stack._removeAllowedFieldsForType('selectable', ['a', 'b']);
        stack.selectable.should.deep.eql(['c']);
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype._setAllowedFieldsForType()', function() {
    it('should set selectable fields', function(done) {
      return test(function(req, res) {
        var stack = req.stack;
        stack._setAllowedFieldsForType('selectable', ['a', 'b', 'c', 'd']);
        stack.selectable.should.deep.eql(['a', 'b', 'c', 'd']);
        return res.sendStatus(204);
      }, done);
    });
    it('should only keep unique values', function(done) {
      return test(function(req, res) {
        var stack = req.stack;
        stack._setAllowedFieldsForType('selectable', ['a', 'b', 'c', 'd', 'a']);
        stack.selectable.should.deep.eql(['a', 'b', 'c', 'd']);
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.addSelectable()', function() {
    it('should add a selectable field', function(done) {
      return test(function(req, res) {
        var stack = req.stack;
        stack.addSelectable('d');
        stack.selectable.should.deep.eql(['a', 'b', 'c', 'd']);
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.addFilterable()', function() {
    it('should add a filterable field', function(done) {
      return test(function(req, res) {
        var stack = req.stack;
        stack.addFilterable('d');
        stack.filterable.should.deep.eql(['a', 'b', 'c', 'd']);
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.addSortable()', function() {
    it('should add a sortable field', function(done) {
      return test(function(req, res) {
        var stack = req.stack;
        stack.addSortable('d');
        stack.sortable.should.deep.eql(['a', 'b', 'c', 'd']);
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.addWritable()', function() {
    it('should add a writable field', function(done) {
      return test(function(req, res) {
        var stack = req.stack;
        stack.addWritable('d');
        stack.writable.should.deep.eql(['a', 'b', 'c', 'd']);
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.removeSelectable()', function() {
    it('should remove a selectable field', function(done) {
      return test(function(req, res) {
        var stack = req.stack;
        stack.removeSelectable('c');
        stack.selectable.should.deep.eql(['a', 'b']);
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.removeFilterable()', function() {
    it('should remove a filterable field', function(done) {
      return test(function(req, res) {
        var stack = req.stack;
        stack.removeFilterable('c');
        stack.filterable.should.deep.eql(['a', 'b']);
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.removeSortable()', function() {
    it('should remove a sortable field', function(done) {
      return test(function(req, res) {
        var stack = req.stack;
        stack.removeSortable('c');
        stack.sortable.should.deep.eql(['a', 'b']);
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.removeWritable()', function() {
    it('should remove a writable field', function(done) {
      return test(function(req, res) {
        var stack = req.stack;
        stack.removeWritable('c');
        stack.writable.should.deep.eql(['a', 'b']);
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.setSelectable()', function() {
    it('should set selectable fields', function(done) {
      return test(function(req, res) {
        var stack = req.stack;
        stack.setSelectable(['a', 'b']);
        stack.selectable.should.deep.eql(['a', 'b']);
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.setFilterable()', function() {
    it('should set filterable fields', function(done) {
      return test(function(req, res) {
        var stack = req.stack;
        stack.setFilterable(['a', 'b']);
        stack.filterable.should.deep.eql(['a', 'b']);
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.setSortable()', function() {
    it('should set sortable fields', function(done) {
      return test(function(req, res) {
        var stack = req.stack;
        stack.setSortable(['a', 'b']);
        stack.sortable.should.deep.eql(['a', 'b']);
        return res.sendStatus(204);
      }, done);
    });
  });

  describe('.prototype.setWritable()', function() {
    it('should set writable fields', function(done) {
      return test(function(req, res) {
        var stack = req.stack;
        stack.setWritable(['a', 'b']);
        stack.writable.should.deep.eql(['a', 'b']);
        return res.sendStatus(204);
      }, done);
    });
  });


});