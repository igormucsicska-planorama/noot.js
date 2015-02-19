/**
 * Dependencies
 */
var NOOT = require('../../../')('object', 'http');
var _ = require('lodash');

var Resource = require('./resources/lib/resource');
var RoutesSorter = require('./routes-sorter');
var Authable = require('./mixins/authable');
var MessagesProvider = require('./messages-provider');


/***********************************************************************************************************************
 * A tastypie like APIs manager.
 *
 * **Basic example**
 *
 * ```javascript
 * var mongoose = require('mongoose');
 * var express = require('express');
 * var http = require('http');
 * var NOOT = require('noot')('api');
 *
 * var app = express();
 *
 * var User = mongoose.model('User', {
 *  firstName: String,
 *  lastName: String,
 *  email: { type: String, required: true },
 *  password: { type: String, required: true }
 * );
 *
 *
 * NOOT.API.create({ name: 'my-api', server: app })
 *   .registerResource('User', NOOT.API.MongooseResource.extend({
 *     model: User,
 *     nonSelectable: ['password']
 *   ))
 *   .launch();
 *
 * http.createServer(app).listen(process.env.PORT || '8888');
 * ```
 *
 *
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
   * Map of resources.
   *
   * @property resources
   * @type Object
   */
  resources: null,

  /**
   * Array of routes, contains all routes for all resources.
   *
   * @property routes
   * @type Array
   */
  routes: null,

  /**
   * Instance of NOOT.API.MessagesProvider. Define your own by extending the root class or let NOOT create one for you.
   *
   * @property messagesProvider
   * @type NOOT.API.MessagesProvider
   */
  messagesProvider: null,

  /**
   * Defines whether or not internal server errors (500) messages should be overriden. If `true`,
   * `messagesProvider.defaultInternalServerError()` will be used by `errorHandler`.
   *
   * @property shouldOverrideInternalServerErrorsMessages
   * @type Boolean
   * @default false
   */
  shouldOverrideInternalServerErrorsMessages: false,

  /**
   * Shortcut for `routes` paths.
   *
   * @property routesPaths
   * @type Array of String
   * @readOnly
   */
  get routesPaths() { return this.routes.map(function(route) { return route.path; }); },

  /**
   * Express style error handler. Takes care of calling `stack.resource.sendResponse()` with proper response format. You
   * can define your own or set it null if you prefer using an external handler.
   *
   * @property errorHandler
   * @type Function
   */
  /* jshint unused: false */
  errorHandler: function(err, req, res, next) {
    var stack = req.noot.stack;
    stack.append({ error: true });
    if (err.statusCode) stack.setStatus(err.statusCode);
    if (err.code) stack.append({ code: err.code });
    if (stack.statusCode === NOOT.HTTP.InternalServerError) {
      if (this.shouldOverrideInternalServerErrorsMessages) {
        err.message = this.messagesProvider.defaultInternalServerError();
      }
    }
    if (err.message) stack.pushMessage(err.message);
    return req.noot.resource.sendResponse(stack);
  },
  /* jshint unused: true */


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

    NOOT.makeReadOnly(this, 'resources', resources);
    NOOT.makeReadOnly(this, 'routes', routes);
  },

  /**
   * Register a single resource.
   *
   * @method registerResource
   * @param {String} name Name of the resource to register
   * @param {Class} resource A {{#crossLink "NOOT.API.Resource"}}{{/crossLink}} **class** that will be
   * instantiated by the API
   * @chainable
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
   * @param {Object} resources Map of resources ({{#crossLink "NOOT.API.Resource"}}{{/crossLink}} **classes**)
   * @chainable
   */
  registerResources: function(resources) {
    for (var name in resources) {
      this.registerResource(name, resources[name]);
    }
    return this;
  }

}, {

  /**
   * Shortcut for accessing NOOT.API.RoutesSorter.
   *
   * @method sortRoutes
   * @param {[NOOT.API.Route]} routes An array of NOOT.API.Route
   * @return {Array} The same array (same reference), sorted.
   * @static
   */
  sortRoutes: function(routes) {
    return RoutesSorter.compute(routes);
  }

});


/**
 * @exports
 */
module.exports = API;