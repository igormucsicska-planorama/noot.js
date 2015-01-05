var NOOT = nootrequire('api');
var express = require('express');

describe('NOOT.API', function() {

  describe('.init()', function() {
    it('should not create an instance (missing `server`)', function() {
      (function() { NOOT.API.create(); }).should.throw(/server/);
    });

    it('should create an instance and initialize properties', function() {
      var api = NOOT.API.create({ server: express() });
      api._resources.should.deep.eql([]);
      api._routes.should.deep.eql([]);
    });
  });

});