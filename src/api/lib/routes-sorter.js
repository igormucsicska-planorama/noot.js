/**
 * Dependencies
 */
var NOOT = require('../../../')('namespace');
var _ = require('lodash');

/***********************************************************************************************************************
 * RoutesSorter
 ***********************************************************************************************************************
 *
 *
 *
 **********************************************************************************************************************/
var RoutesSorter = NOOT.Namespace.create({

  /**
   * Path weights enumeration
   */
  _PATH_WEIGHTS: { FIXED: 3, PARAM: 2, OPTIONAL: 1, BLANK: 0 },

  /**
   *
   *
   * @param {Array} routes
   * @returns {*}
   */
  compute: function(routes) {
    var routesByMethod = _.groupBy(routes.map(function(route, i) {
      return { method: (route.method || '').toLowerCase(), path: route.path, originalIndex: i };
    }), 'method');

    for (var methodName in routesByMethod) {
      this._computeMethodRoutes(routesByMethod[methodName]);
    }

    var sorted = [];
    var tmp = routes.splice(0, routes.length);

    Object.keys(routesByMethod).sort().forEach(function(methodName) {
      sorted = sorted.concat(routesByMethod[methodName]);
    });

    sorted.forEach(function(route, i) {
      routes[i] = tmp[route.originalIndex];
    });

    return routes;
  },

  /**
   *
   *
   * @param {Array} routes
   * @private
   */
  _computeMethodRoutes: function(routes) {
    var self = this;
    var maxPartsLength = 0;

    routes.forEach(function(route) {
      route.parts = _.compact(route.path.split('/')).map(self._getPathWeight, self);
      var routePartsLength = route.parts.length;
      if (routePartsLength > maxPartsLength) maxPartsLength = routePartsLength;
    });

    routes.forEach(function(route) {
      self._fillPartsArray(route.parts, maxPartsLength);
    });

    routes.sort(function(a, b) {
      return a.path < b.path ? -1 : a.path === b.path ? 0 : 1;
    });

    routes.sort(function(a, b) {
      for (var i = 0; i < maxPartsLength; i++) {
        var aVal = a.parts[i];
        var bVal = b.parts[i];
        if (aVal === bVal) continue;
        return aVal > bVal ? -1 : 1;
      }
      return 0;
    });
  },

  /**
   *
   *
   * @param {String} str
   * @returns {Number}
   * @private
   */
  _getPathWeight: function(str) {
    return str.match(/^:/) ?
      (str.match(/\?$/) ? RoutesSorter._PATH_WEIGHTS.OPTIONAL : RoutesSorter._PATH_WEIGHTS.PARAM) :
      RoutesSorter._PATH_WEIGHTS.FIXED;
  },

  /**
   *
   *
   * @param {Array} arr
   * @param {Number} length
   * @returns {Array}
   * @private
   */
  _fillPartsArray: function(arr, length) {
    while (arr.length < length) {
      arr.push(RoutesSorter._PATH_WEIGHTS.BLANK);
    }
    return arr;
  }

});

/**
 * @module
 */
module.exports = RoutesSorter;
