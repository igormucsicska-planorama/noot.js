/**
 * Dependencies
 */
var NOOT = require('../../../')('object', 'http');
var _ = require('lodash');

var Resource = require('./resources/lib/resource');
var RoutesSorter = require('./routes-sorter');
var Authable = require('./interfaces/authable');
var Utils = require('./utils');
var MessagesProvider = require('./messages-provider');


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
   */
  resources: null,

  /**
   * @property _routes
   * @type Array
   */
  routes: null,

  messagesProvider: null,

  /**
   *
   */
  requestsLogger: false,

  shouldOverrideInternalServerErrorsMessages: false,

  /**
   *
   */
  /* jshint unused: false */
  errorHandler: function(err, req, res, next) {
    var stack = req.nootApiStack;
    stack.append({ error: true });
    if (err.statusCode) stack.setStatus(err.statusCode);
    if (err.code) stack.append({ code: err.code });
    if (stack.statusCode === NOOT.HTTP.InternalServerError) {
      if (this.shouldOverrideInternalServerErrorsMessages) {
        err.message = this.messagesProvider.defaultInternalServerError();
      }
      console.log(err.stack); // TODO remove this line
    }
    if (err.message) stack.pushMessage(err.message);
    return stack.resource.sendResponse(stack);
  },
  /* jshint unused: true */

  /**
   *
   * @property routesPaths
   * @type Array of String
   * @readOnly
   */
  get routesPaths() { return this.routes.map(function(route) { return route.path; }); },

  /**
   * Constructor
   */
  init: function() {
    NOOT.required(this, 'server');
    this.resources = {};
    this.routes = [];
    if (!(this.messagesProvider instanceof MessagesProvider)) this.messagesProvider = MessagesProvider.create();
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

    var resources = _.mapValues(this.resources, function(resourceClass) {
      var instance = resourceClass.create({ api: self });
      allRoutes = allRoutes.concat(instance.routes);
      return instance;
    });

    var routes = API.sortRoutes(allRoutes);

    routes.forEach(function(route) {
      server[route.method].apply(server, [route.path].concat(route.handlers));
    });

    if (this.errorHandler) server.use(this.errorHandler);

    Utils.makeReadOnly(this, 'resources', resources);
    Utils.makeReadOnly(this, 'routes', routes);
  },

  /**
   * Register a single resource.
   *
   * @method registerResource
   * @chainable
   * @param {String} name Name of the resource to register
   * @param {Class} resource A {{#crossLink "NOOT.API.Resource"}}{{/crossLink}} **class** that will be
   * instantiated by the API
   */
  registerResource: function(name, resource) {
    if (this.resources[name]) throw new Error('A resource `' + name + '` is already registered');
    if (!Resource.detect(resource)) {
      if (resource instanceof Resource) throw new Error('You must register classes, not instances');
      throw new Error('Not a subclass of NOOT.API.Resource');
    }
    this.resources[name] = resource;
    return this;
  },

  /**
   * Register multiple resources.
   *
   * @method registerResources
   * @chainable
   * @param {Object} resources Map of resources ({{#crossLink "NOOT.API.Resource"}}{{/crossLink}} **classes**)
   */
  registerResources: function(resources) {
    for (var name in resources) {
      this.registerResource(name, resources[name]);
    }
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