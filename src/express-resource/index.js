var NOOT = require('../../index')('object', 'url', 'errors');
var _ = require('lodash');
var mongoose = require('mongoose');

var Route = require('./lib/route');


var Resource = NOOT.Object.extend({
  version: '',
  path: '',

  _routes: [],

  model: null,

  selectableFields: null,
  nonSelectableFields: null,
  filterableFields: null,
  nonFilterableFields: null,
  sortableFields: null,
  nonSortableFields: null,

  allowedRoutes: ['get', 'post', 'delete', 'patch', 'put'],

  actions: {

  },

  beforeAll: [],

  afterAll: [],

  init: function() {
    if (!this.model) throw new Error('NOOT.ExpressResource requires a mongoose `model`');

    this._buildFields();
    this._buildRoutes();
  },

  _getModelFields: function() {
    return Object.keys(this.model.schema.tree);
  },


  register: function(server) {
    return this._routes.forEach(function(route) {
      var args = route.handlers;
      args.unshift(route.path);
      return server[route.method].apply(server, args);
    });
  },

  _buildFields: function() {
    var modelFields = this._getModelFields();

    this.selectableFields = this.selectableFields || modelFields.slice(0);
    if (this.nonSelectableFields) this.selectableFields = _.difference(this.selectableFields, this.nonSelectableFields);

    this.filterableFields = this.filterableFields || modelFields.slice(0);
    if (this.nonFilterableFields) this.filterableFields = _.difference(this.filterableFields, this.nonFilterableFields);

    this.sortableFields = this.sortableFields || modelFields.slice(0);
    if (this.nonSortableFields) this.sortableFields = _.difference(this.sortableFields, this.nonSortableFields);
  },

  _buildRoutes: function() {
    var self = this;
    var beforeAll = this.beforeAll || [];
    var afterAll = this.afterAll  || [];

    this._routes = this.allowedRoutes.map(function(verb) {
      var route;
      var userDefined = self[verb.toUpperCase()];
      if (userDefined) {
        route = Route.create(_.extend({
          method: verb,
          path: self._getDefaultPathByVerb(verb)
        }, userDefined));
      } else {
        route = self._getDefaultRouteByVerb(verb);
      }

      route.handlers = beforeAll.concat(route.handlers).concat(afterAll).map(function(handler) {
        return handler.bind(self);
      }.bind(this));


      return route;
    });

    this._routes = Resource.orderRoutes(this._routes);
  },




  _orderPaths: function(paths) {
    var map = paths.map(function(path) { return path.split('/'); });


  },

  _getMatchFromQueryString: function(query) {
    var fields = {};

    for (var key in query) {
      var split = key.split('__');
      var fieldName = split[0];
      var operator = split[1];
      fields[fieldName] = operator ? (fields[fieldName] || {}) : query[key];
      if (operator) fields[fieldName]['$' + operator] = query[key];
    }

    var final = _.pick(fields, this.filterableFields);

    var notSupportedFields = _.difference(Object.keys(final), Object.keys(fields));
    if (notSupportedFields.length) {
      throw new Error('Filtering on fields "' + notSupportedFields.join(', ') + '" is not supported');
    }

    return final;
  },

  _getSelectFromQueryString: function(query) {
    var select = query.select || '';
    var unselect = query.unselect || '';
    select = _.intersection(select.split(','), this.selectableFields);
    select = select.length ? select : this.selectableFields;
    select = _.difference(select, unselect.split(','));
    return select.join(' ');
  },

  _getSortFromQueryString: function(query) {
    var sortableFields = this.sortableFields;
    return (query.sortBy || '').split(',').filter(function(field) {
      return ~sortableFields.indexOf(field.replace(/^-/, ''));
    }).join(' ');
  },

  _sendResponse: function(req, res, options, statusCode) {
    statusCode = statusCode || 200;
    return res.status(statusCode).json(options);
  },


  _parseQueryString: function(query) {
    console.log({
      match: this._getMatchFromQueryString(query),
      select: this._getSelectFromQueryString(query) || null,
      sort: this._getSortFromQueryString(query) || '_id',
      limit: query.limit || 0,
      offset: query.offset || 0
    });
    return {
      match: this._getMatchFromQueryString(query),
      select: this._getSelectFromQueryString(query) || null,
      sort: this._getSortFromQueryString(query) || '_id',
      limit: query.limit || 0,
      offset: query.offset || 0
    };
  },

  _getDefaultPathByVerb: function(verb) {
    switch (verb.toLowerCase()) {
      case 'get': return this._buildRoutePath(this.path, '/:id?');
      case 'put': return this._buildRoutePath(this.path, '/:id');
      case 'patch': return this._buildRoutePath(this.path, '/:id');
      default: return this._buildRoutePath(this.path, '/');
    }
  },

  _buildRoutePath: function(routePath) {
    var args = ['/', this.apiVersion].concat(NOOT.makeArray(arguments));
    return NOOT.Url.join.apply(NOOT.Url, args);
  },

  _getDefaultRouteByVerb: function(verb) {
    return Route.create({
      method: verb,
      path: this._getDefaultPathByVerb(verb),
      handlers: [Resource['_DEFAULT_' + verb.toUpperCase() + '_HANDLER']]
    });
  },

  _filterDocument: function(doc) {
    return _.pick(doc.toObject ? doc.toObject() : doc, this.selectableFields);
  }

}, {

  /**
   * Orders the given array of routes.
   * Example for a route object:
   * {
   *   method: 'delete',
   *   path: '/v1/user/',
   *   handlers: [function]
   * }
   * The sorting doesn't deal with handlers, so for testing the method and path parameters are enough.
   *
   * @param {[Object]} routes
   * @returns {[Object]}
   */
  orderRoutes: function(routes) {
    // list parameters into an array within the _routes.
    routes.forEach(function (route) {
      route.params = [];
      var path = route.path;
      var result;
      do {
        var regexp = /\:([A-Za-z_]+)\/?/;
        result = regexp.exec(path);
        if (result) {
          route.params.push(result.slice(1).toString());
          path = path.replace(regexp, '');
        }
      } while (result);
    });

    var first = [];
    var middle = [];
    var last = [];

    // initial primitive sorting
    routes.forEach(function (route) {
      if (route.path === '/') {
        first.push(route);
      } else if (/\:[A-Za-z0-9@._-]+/.test(route.path)) {
        middle.push(route);
      } else {
        last.push(route);
      }
    });

    // finer sorting method
    // TODO: unify this with the initial sorting and get rid of the first, middle and last arrays.
    function sort (a, b) {
      if (a.params.length < b.params.length) {
        return true;
      }

      if (b.path.indexOf(a.path) === 0) {
        return true;
      }

      var aSplitBySlash = a.path.split('/').length;
      var bSplitBySlash = b.path.split('/').length;
      var aSplitByColon = a.path.split(':')[0].split('/').length;
      var bSplitByColon = b.path.split(':')[0].split('/').length;
      if (aSplitBySlash < bSplitBySlash) {
        return true;
      } else if (aSplitBySlash > bSplitBySlash) {
        return false;
      } else if (aSplitByColon !== bSplitByColon) {
        return aSplitByColon < bSplitByColon;
      } else if (a.path.length !== b.path.length) {
        return a.path.length < b.path.length;
      } else {
        return a.path > b.path;
      }
    }

    first.sort(sort);
    middle.sort(sort);
    last.sort(sort);

    return _.sortBy(first.concat(middle, last), 'method');
  },

  _DEFAULT_GET_HANDLER: function(req, res, next) {
    var self = this;
    var id = req.param('id');

    var queryArguments;

    try {
      queryArguments = this._parseQueryString(req.query);
    } catch (ex) {
      return next(new NOOT.Errors.BadRequest(ex.message));
    }

    var query = id ?
                this.model.findById(id, queryArguments.select) :
                this.model.find(queryArguments.match, queryArguments.select);

    return query
      .sort(queryArguments.sort)
      .limit(queryArguments.limit)
      .skip(queryArguments.offset)
      .exec(function(err, results) {
        if (err) return next(err);
        if (!results) return next();

        results = id ?
                  self._filterDocument(results) :
                  results.map(self._filterDocument.bind(self));

        return self._sendResponse(req, res, { data: results });
      });
  },

  _DEFAULT_POST_HANDLER: function(req, res, next) {
    var self = this;
    return this.model.create(req.body, function(err, item) {
      if (err) return next(err);
      return self._sendResponse(req, res, { data: self._filterDocument(item) }, 201);
    });
  },

  _DEFAULT_PATCH_HANDLER: function(req, res, next) {
    var self = this;
    return this.model.findAndModify({ _id: req.param('id') }, { $set: req.body }, { new: true }, function(err, item) {
      if (err) return next(err);
      if (!item) return next();
      return self._sendResponse(req, res, { data: self._filterDocument(item) });
    });
  },

  _DEFAULT_PUT_HANDLER: function(req, res, next) {
    var self = this;
    var id = req.param('id');
    return this.model.findAndModify({ _id: id }, req.body, { upsert: true, new: true }, function(err, item) {
      if (err) return next(err);
      if (!item) return next();
      return self._sendResponse(req, res, { data: self._filterDocument(item) });
    });
  },

  _DEFAULT_DELETE_HANDLER: function(req, res, next) {
    var self = this;
    var id = req.param('id');
    return this.model.remove({ _id: req.param('id') }, function(err, removed) {
      if (err) return next(err);
      if (!removed) return next();
      return res.respond(req, res, { message: 'Object ' + id + 'has been successfully removed' }, 204);
    });
  }
});





module.exports = Resource;