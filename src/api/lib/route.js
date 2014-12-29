/**
 * Dependencies
 */
var NOOT = require('../../../')('object', 'url');
var _ = require('lodash');


/***********************************************************************************************************************
 * NOOT.Api.Route
 ***********************************************************************************************************************
 *
 *
 *
 *
 **********************************************************************************************************************/
var Route = NOOT.Object.extend({
  resource: null,
  path: '',
  _path: '',
  schema: null,
  authenticator: null,
  method: 'get',
  handlers: null,

  /**
   * Constructor
   */
  init: function() {
    if (!this.resource) throw new Error('Route needs a `resource`');
    if (!this.path) throw new Error('Cannot declare a route without a `path`');
    this.path = NOOT.Url.join('/', this.resource.apiVersion || '', this.resource.path, this.path).replace(/\/$/, '');
    this.method = this.method.toLowerCase();
    this.handlers = this.handlers || [];
    if (this.schema) this.handlers.unshift(this.validate);
    if (this.authenticator) this.handlers.unshift(this.authenticator);
  },

  /**
   * Validate body against JSON schema
   *
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  validate: function(req, res, next) {

  }
});

/**
 * @exports
 */
module.exports = Route;