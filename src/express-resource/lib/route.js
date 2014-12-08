var NOOT = require('../../../')('object');
var _ = require('lodash');

var Route = NOOT.Object.extend({
  path: '',
  schema: null,
  method: 'get',
  handlers: null,
  init: function() {
    if (!this.path) throw new Error('Cannot declare a route without a `path`');
    this.method = this.method.toLowerCase();
    this.handlers = this.handlers || [];
    if (this.schema) this.handlers.unshift(this.validate);
  },

  validate: function(req, res, next) {

  }
});


module.exports = Route;