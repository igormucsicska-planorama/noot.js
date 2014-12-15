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

  /**
   * Constructor
   */
  init: function() {
    if (!this.server) throw new Error('NOOT.Api requires a `server`');
    this.resources = this.resources || {};
  },

  /**
   * Register a single resource
   *
   * @param {NOOT.Api.Resource} resource
   */
  registerResource: function(resource) {
    if (!(resource instanceof Resource)) throw new Error('Not a NOOT resource');
    this.resources[resource.model.modelName] = resource;
    resource.apiVersion = this.version;
    return this;
  },

  /**
   * Register multiple resources
   *
   * @param {NOOT.Api.Resource...} resource
   */
  registerResources: function() {
    NOOT.toFlatArray(NOOT.makeArray(arguments)).forEach(this.registerResource.bind(this));
    return this;
  },

  /**
   *
   */
  launch: function() {
    var self = this;

    var routes = _.values(this.resources).reduce(function(prev, resource) {
      resource._register();
      return prev.concat(resource.routes);
    }, []);

    API.orderRoutes(routes).forEach(function(route) {
      var args = route.handlers.slice(0);
      args.unshift(route.path);
      return self.server[route.method].apply(self.server, args);
    });
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