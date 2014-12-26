var NOOT = nootrequire('api');
var express = require('express');


describe('NOOT.API', function() {


  it('should not create an instance (missing `server`)', function() {
    (function() { NOOT.API.create(); }).should.throw(/server/);
  });

  it('should create an instance and initialize properties', function() {
    var api = NOOT.API.create({ server: express() });
    api.resources.should.deep.eql({});
    api._routes.should.deep.eql([]);
  });

  it('should order routes', function() {
    var route5 = { path: '/users/:id/me/friends', method: 'GET' };
    var route4 = { path: '/users/:id/friends/:id', method: 'GET' };
    var route3 = { path: '/users/:id/me', method: 'GET' };
    var route1 = { path: '/users/:id?', method: 'GET' };
    var route2 = { path: '/users', method: 'GET' };

    var route6 = { path: '/users', method: 'POST' };
    var route7 = { path: '/users/', method: 'POST' };

    var route8 = { path: '/users/:id', method: 'PUT' };

    var route9 = { path: '/users/:id', method: 'DELETE' };

    /*
    RESULT
    [ 0, 1, 0, 0 ]
    [ 0, 1, 0, 1 ]
    [ 0, 1, 0 ]
    [ 0, 2 ]
    [ 0 ]


     */


    /*
    DATA
     [ 0, 1, 0, 1 ]
     [ 0, 2 ]
     [ 0, 1, 0, 0 ]
     [ 0 ]
     [ 0, 1, 0 ]

     */


    var result = [
      route9,

      route5,
      route4,
      route3,
      route1,
      route2,

      route6,
      route7,

      route8
    ];


    NOOT.API.orderRoutes([
      route6,
      route8,
      route9,
      route4,
      route1,
      route5,
      route7,
      route2,
      route3
    ]).should.deep.eql(result);

  });




});