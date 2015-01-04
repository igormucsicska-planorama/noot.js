/**
 * Dependencies
 */
var NOOT = require('../../../')('object');
var _ = require('lodash');

var Resource = require('./resource');
var RoutesSorter = require('./routes-sorter');
var Authable = require('./authable');


/***********************************************************************************************************************
 * @class API
 * @constructor
 * @namespace NOOT
 * @extends NOOT.Object
 * @uses NOOT.API.Authable
 **********************************************************************************************************************/
var API = NOOT.Object.extend(Authable).extend({

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
      var instance = resourceClass.create({ api: self, _authableParent: self });
      allRoutes = allRoutes.concat(instance._routes);
      return instance;
    });

    this._routes = API.sortRoutes(allRoutes);

    this._routes.forEach(function(route) {
      server[route.method].apply(server, [route.path].concat(route._handlers));
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
 * @exports
 */
module.exports = API;