/**
 * Dependencies
 */
var NOOT = require('../../')('object');
var Resource = require('./lib/resource');
var Route = require('./lib/route');
var RoutesSorter = require('./lib/routes-sorter');
var _ = require('lodash');


/***********************************************************************************************************************
 * @class API
 * @constructor
 * @namespace NOOT
 * @extends NOOT.Object
 **********************************************************************************************************************/
var API = NOOT.Object.extend({

  /**
   * Prefix for this API, simply ignored if not provided. To be applied on all resources routes paths.
   *
   * @property [name]
   * @type String
   */
  name: '',

  /**
   * An Express application.
   *
   * @property server
   * @type Express
   */
  server: null,

  /**
   * @property _resources
   * @type Array
   * @private
   */
  _resources: null,

  /**
   * @property _routes
   * @type Array
   * @private
   */
  _routes: null,

  /**
   * Constructor
   */
  init: function() {
    NOOT.required(this, 'server');
    this._resources = [];
    this._routes = [];
  },

  /**
   * Launch the API.
   *
   * @method launch
   */
  launch: function() {
    var self = this;
    var server = this.server;
    var allRoutes = [];
    this._resources = this._resources.map(function(resourceClass) {
      var instance = resourceClass.create({ api: self });
      allRoutes.push(instance._routes);
      return instance;
    });

    this._routes = API.sortRoutes(allRoutes);

    this._routes.forEach(function(route) {
      server[route.method].apply(server, route.handlers);
    });
  },

  /**
   * Register a single resource.
   *
   * @method registerResource
   * @chainable
   * @param {Class} resource A {{#crossLink "NOOT.API.Resource"}}{{/crossLink}} **class** that will be
   * instantiated by the API
   */
  registerResource: function(resource) {
    if (!Resource.detect(resource)) {
      if (resource instanceof Resource) throw new Error('You must register classes, not instances');
      throw new Error('Not a subclass of NOOT.API.Resource');
    }
    this._resources.push(resource);
    return this;
  },

  /**
   * Register multiple resources.
   *
   * @method registerResources
   * @chainable
   * @param {Class} resources,... A list of arguments ({{#crossLink "NOOT.API.Resource"}}{{/crossLink}} **classes**)
   */
  registerResources: function() {
    _.flatten(NOOT.makeArray(arguments)).forEach(this.registerResource.bind(this));
    return this;
  }

}, {

  /**
   *
   * @method sortRoutes
   * @static
   * @param {[NOOT.API.Route]} routes An array of NOOT.API.Route
   * @return {Array} The same array (same reference), sorted.
   */
  sortRoutes: function(routes) {
    return RoutesSorter.compute(routes);
  }

});


/**
 * See {{#crossLink "NOOT.API.Resource"}}{{/crossLink}}.
 *
 * @property Resource
 * @static
 * @type {*}
 */
API.Resource = Resource;

/**
 * See {{#crossLink "NOOT.API.Route"}}{{/crossLink}}.
 *
 * @property Route
 * @static
 * @type {*}
 */
API.Route = Route;

/**
 * @exports
 */
module.exports = API;