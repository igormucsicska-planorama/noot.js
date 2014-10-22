var NOOT = require('../../../')('object');
var mongoose = require('mongoose');
var MongooseSchema = mongoose.Schema;
var _ = require('lodash');

var Schema = NOOT.noop;

var K = function() { return this; }; // Empty function

/**
 * Build "_super" implementation
 *
 * @param {Object} dest Object to contain the resulting properties
 * @param {Object} parent Parent properties
 * @param {Object} child Child properties
 */
var buildSuper = function(dest, parent, child) {
  for (var prop in child) {
    dest[prop] = (typeof child[prop] === 'function') ?
                 (function (name, fn) {
                   return function () {
                     var tmp = this._super;
                     this._super = ('function' === typeof parent[name]) ? parent[name] : K;
                     var ret = fn.apply(this, arguments);
                     this._super = tmp;
                     return ret;
                   };
                 })(prop, child[prop]) :
                 child[prop];
  }

  for (var parentProp in parent) {
    if (NOOT.isUndefined(dest[parentProp])) dest[parentProp] = parent[parentProp];
  }
};

Schema.extend = function(definition) {
  var properties = definition.schema || {};
  var parentProperties = (this.__nootDef && this.__nootDef.schema) || {};
  for (var key in parentProperties) {
    if (NOOT.isUndefined(properties[key])) properties[key] = _.cloneDeep(parentProperties[key]);
  }
  var schema = new MongooseSchema(properties, _.merge({}, this.options || {}, definition.options));
  buildSuper(schema.methods, this.methods || {}, definition.methods);
  buildSuper(schema.statics, this.statics || {}, definition.statics);
  schema.extend = Schema.extend.bind(schema);
  schema.__nootDef = definition;
  return schema;
};


module.exports = Schema;