var NOOT = nootrequire('api');
var _ = require('lodash');

var RoutesSorter = NOOT.API.RoutesSorter;

describe('NOOT.API.RoutesSorter', function() {

  describe('.compute()', function() {
    var result = [
      // DELETE
      { path: '/users/:id', method: 'DELETE' },
      // GET
      { path: '/all/is/fixed', method: 'GET' },
      { path: '/customers/me/:id/:other-id/she', method: 'GET' },
      { path: '/users/:id/me/friends', method: 'GET' },
      { path: '/users/:id/friends/:id', method: 'GET' },
      { path: '/customers/:id/purchases', method: 'GET' },
      { path: '/users/:id/me', method: 'GET' },
      { path: '/customers/:id/:other-id', method: 'GET' },
      { path: '/customers/:id', method: 'GET' },
      { path: '/customers/:id?', method: 'GET' },
      { path: '/users/:id?', method: 'GET' },
      { path: '/users', method: 'GET' },
      { path: '/:type/fixed', method: 'GET' },
      { path: '/:type/:other-type', method: 'GET' },
      { path: '/:unknown', method: 'GET' },
      // POST
      { path: '/users', method: 'POST' },
      // PUT
      { path: '/users/:id', method: 'PUT' }
    ];

    it('should always return the same result', function() {
      var prev;
      _.times(100, function() {
        var sorted = RoutesSorter.compute(_.shuffle(result));
        if (prev) sorted.should.deep.eql(prev);
        prev = sorted;
      });
    });

    it('should order shuffled routes (100 different shuffles)', function() {
      _.times(100, function() {
        RoutesSorter.compute(_.shuffle(result)).should.deep.eql(result);
      });
    });

    it('should have kept reference', function() {
      var toOrder = _.shuffle(result);
      (RoutesSorter.compute(toOrder) === toOrder).should.eql(true);
    });
  });

});