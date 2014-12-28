/**
 * Dependencies
 */
var NOOT = require('../../')('object');
var _ = require('lodash');
var Resource = require('./lib/resource');
var Route = require('./lib/route');
var RoutesSorter = require('./lib/routes-sorter');

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
   * Order a list of routes
   *
   * @info Routes must respect the following format : { path: String, method: String }
   *
   * @param {Array} routes
   */
  _oldOrderRoutes: function(routes) {
    var PART_TYPES = { OPTIONNAL: 0, PARAM: 1, FIXED: 2 };
    var indexesMap = [];

    var groupedMap = {};

    routes.forEach(function(route, i) {
      var method = (route.method || '').toString().toLowerCase();
      groupedMap[method] = groupedMap[method] || [];
      groupedMap[method].push({ path: route.path, index: i });
    });

    for (var method in groupedMap) {
      var methodRoutes = groupedMap[method];
      methodRoutes = methodRoutes.map(function(route) {
        route.parts = _.compact(route.path.split('/')).map(function(part) {
          if (NOOT.isRegExp(part)) throw new Error('Sorting of RegExps based routes is not supported');
          return part.match(/^:/) ? (part.match(/\?$/) ? PART_TYPES.OPTIONNAL : PART_TYPES.PARAM) : PART_TYPES.FIXED;
        });

        return route;
      });

      var methodRoutesByPartsLength = _.groupBy(methodRoutes, function(route) { return route.parts.length; });
      methodRoutes = [];

      for (var partsLength in methodRoutesByPartsLength) {
        methodRoutesByPartsLength[partsLength] = methodRoutesByPartsLength[partsLength]
          .sort(function(a, b) {
            if (a.path === b.path) return 0;
            else if (a.path < b.path) return 1;
            else return -1;
          })
          .sort(function(a, b) {
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

    var allValues = routes.splice(0, routes.length);

    indexesMap.forEach(function(targetIndex, i) {
      routes[i] = allValues[targetIndex];
    });

    return routes;
  },



  sortRoutes: function(routes) {
    return RoutesSorter.compute(routes);
  }



});

/**
 * Attach some classes to main namespace
 */
API.Resource = Resource;
API.Route = Route;
API.RoutesSorter = RoutesSorter;

/**
 * @module
 */
module.exports = API;