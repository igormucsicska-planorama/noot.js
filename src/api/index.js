/**
 * Dependencies
 */
var NOOT = require('../../')('object');
var _ = require('lodash');
var Resource = require('./lib/resource');
var Route = require('./lib/route');

/***********************************************************************************************************************
 * NOOT.API
 ***********************************************************************************************************************
 *
 *
 *
 *
 **********************************************************************************************************************/
var API = NOOT.Object.extend({
  version: '',
  server: null,
  resources: null,

  _isLaunched: false,

  _routes: null,

  /**
   * Constructor
   */
  init: function() {
    NOOT.required(this, 'server');
    this.resources = {};
    this._routes = [];
  },

  /**
   *
   */
  launch: function() {
    this._checkLaunched();

    var self = this;

    var routes = _.values(this.resources).reduce(function(prev, resource) {
      return prev.concat(resource.getRoutes());
    }, []);

    API.orderRoutes(routes).forEach(function(route) {
      if (!(route instanceof Route)) throw new Error('Not a `NOOT.API.Route`');
      var args = route.handlers.slice(0);
      args.unshift(route.path);
      return self.server[route.method].apply(self.server, args);
    });

    this._isLaunched = true;
  },

  /**
   * Register a single resource
   *
   * @param {Resource} resource
   */
  registerResource: function(resource) {
    this._checkLaunched();
    if (!(resource instanceof Resource)) throw new Error('Not a NOOT resource');
    this.resources[resource.model.modelName] = resource;
    resource.apiVersion = this.version;
    return this;
  },

  /**
   * Register multiple resources
   *
   * @param {Resource...} resources
   */
  registerResources: function(resources) {
    this._checkLaunched();
    NOOT.toFlatArray(NOOT.makeArray(arguments)).forEach(this.registerResource.bind(this));
    return this;
  },

  /**
   * Ensure resources are not added after API is launched. Throw an error if need be
   *
   * @private
   */
  _checkLaunched: function() {
    if (this._isLaunched) throw new Error('Cannot modify API\'s routes once it\'s launched');
  }

}, {

  /**
   * Order a list of NOOT.API.Route
   *
   * @param {Array} routes
   */
  orderRoutes: function(routes) {
    var PART_TYPES = { OPTIONNAL: 0, PARAM: 1, FIXED: 2 };
    var ret = [];
    var indexesMap = [];

    var groupedMap = {};
    routes.forEach(function(route, i) {
      var method = (route.method || '').toString().toLowerCase();
      groupedMap[method] = groupedMap[method] || [];
      groupedMap[method].push({ path: route.path, index: i });
    });


    for (var method in groupedMap) {
      console.log('------------', method, '----------------------');

      var methodRoutes = groupedMap[method];
      methodRoutes = methodRoutes.map(function(route) {
        route.parts = _.compact(route.path.split('/')).map(function(part) {
          return part.match(/^:/) ? (part.match(/\?$/) ? PART_TYPES.OPTIONNAL : PART_TYPES.PARAM) : PART_TYPES.FIXED;
        });

        return route;
      });

      var methodRoutesByPartsLength = _.groupBy(methodRoutes, function(route) { return route.parts.length; });
      methodRoutes = [];

      for (var partsLength in methodRoutesByPartsLength) {
        methodRoutesByPartsLength[partsLength] = methodRoutesByPartsLength[partsLength].sort(function(a, b) {
          var aParts = a.parts;
          var bParts = b.parts;

          if (_.isEqual(aParts, bParts)) return 0;

          for (var i = 0; i < partsLength; i++) {
            if (aParts[i] > bParts[i]) return -1;
          }

          return 1;
        });
        methodRoutes[partsLength] = methodRoutesByPartsLength[partsLength];
      }

      methodRoutes = _.compact(methodRoutes).reverse();

      groupedMap[method] = [];

      methodRoutes.forEach(function(routes) {
        routes.forEach(function(route) {
          groupedMap[method].push(route.index);
        });
      });
    }

    Object.keys(groupedMap).sort().forEach(function(methodName) {
      indexesMap = indexesMap.concat(groupedMap[methodName]);
    });

    return indexesMap.map(function(routeIndex) {
      return routes[routeIndex];
    });


  }

});

/**
 * Attach some classes to main namespace
 */
API.Resource = Resource;
API.Route = Route;

/**
 * @module
 */
module.exports = API;