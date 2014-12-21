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
    if (!this.server) throw new Error('NOOT.Api requires a `server`');
    this.resources = this.resources || {};
    this._routes = this._routes || [];
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
    return routes;
    // TODO order routes
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