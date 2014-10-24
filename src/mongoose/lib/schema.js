var NOOT = require('../../../')('object');
var mongoose = require('mongoose');
var MongooseSchema = mongoose.Schema;
var Model = mongoose.Model;
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

/**
 * extend schema, def discriminator, create model
 *
 * @param {Object} definition Schema properties
 * @returns {MongooseSchema}
 */
Schema.extend = function(definition) {

  if (!definition.modelName) throw new Error('You must have a modelName in the schema properties');

  var properties = definition.schema || {};
  var parentProperties = (this.__nootDef && this.__nootDef.schema) || {};
  for (var key in parentProperties) {
    if (NOOT.isUndefined(properties[key])) properties[key] = _.cloneDeep(parentProperties[key]);
  }

  var schema = new MongooseSchema(properties, _.merge({}, this.options || {}, definition.options));
  buildSuper(schema.methods, this.methods || {}, definition.methods);
  buildSuper(schema.statics, this.statics || {}, definition.statics);
  schema.extend = Schema.extend.bind(schema);
  definition.parents = (this.__nootDef && this.__nootDef.parents.slice(0)) || [];
  if (this.__nootDef) definition.parents.push(this.__nootDef.modelName);
  schema.__nootDef = definition;

  var discriminator = {
    __types: {
      type: Array, default: function() { return definition.parents.concat(definition.modelName); }
    }
  };

  schema.add(discriminator);

  var identificator = { __type: { type: String, default: definition.modelName } };
  schema.add(identificator);

  (definition.connection || mongoose).model(definition.modelName, schema);

  return schema;
};

var oldFindOne = Model.findOne;
/**
 * Override findOne method to handle inheritance and find the right document based on the modelName
 *
 * @param {Object} conditions
 * @param {Object} fields
 * @param {Object} options
 * @param {function} callback
 * @returns {*}
 */
Model.findOne = function findOne (conditions, fields, options, callback) {
  if ('function' === typeof options) {
    callback = options;
    options = null;
  } else if ('function' === typeof fields) {
    callback = fields;
    fields = null;
    options = null;
  } else if ('function' === typeof conditions) {
    callback = conditions;
    conditions = {};
    fields = null;
    options = null;
  }

  if (!conditions) conditions = {};
  conditions.__types = this.modelName;

  return oldFindOne.call(this, conditions, fields, options, callback);
};

var oldFind = Model.find;
/**
 *Override find method to handle inheritance and find the right documents based on the modelName
 *
 * @param {Object} conditions
 * @param {Object} fields
 * @param {Object} options
 * @param {function} callback
 * @returns {*}
 */
Model.find = function(conditions, fields, options, callback) {

  if ('function' === typeof conditions) {
    callback = conditions;
    conditions = {};
    fields = null;
    options = null;
  } else if ('function' === typeof fields) {
    callback = fields;
    fields = null;
    options = null;
  } else if ('function' === typeof options) {
    callback = options;
    options = null;
  }

  if (!conditions) conditions = {};
  conditions.__types = this.modelName;

  return oldFind.call(this, conditions, fields, options, callback);
};

var oldInit = Model.prototype.init;
/**
 * Set the prototype based on the discriminator __type
 *
 * @param {Object} doc
 * @param {Object} query
 * @param {function} fn
 * @returns {*}
 */
Model.prototype.init = function (doc, query, fn) {
  var model = this.db.model(doc.__type);
  console.log(fn + '');
  var newFn = function() {
    process.nextTick(function() {
      fn.apply(this, arguments);
    });
  };
  this.schema = model.schema;
  var obj = oldInit.call(this, doc, query, newFn);
  obj.__proto__ = model.prototype;
  return obj;
};

module.exports = Schema;