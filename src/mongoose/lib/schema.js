/**
 * Dependencies
 */
var NOOT = require('../../../')('object', 'internal-utils');
var mongoose = require('mongoose');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var Case = require('case');


/**
 * Variables
 */
var MongooseSchema = mongoose.Schema;
var Model = mongoose.Model;
var Schema = NOOT.noop;

var MIDDLEWARES_PATH = './middlewares';

var oldFindOne = Model.findOne;
var oldFind = Model.find;
var oldInit = Model.prototype.init;
var oldModel = mongoose.model;


/**
 * Extend schema, define discriminator, create model
 *
 * @param {Object} definition Schema properties
 * @returns {MongooseSchema}
 */
Schema.extend = function(definition) {
  definition = definition || {};
  var properties = definition.schema || {};
  var parentProperties = (this.__nootDef && this.__nootDef.schema) || {};
  for (var key in parentProperties) {
    if (NOOT.isUndefined(properties[key])) properties[key] = _.cloneDeep(parentProperties[key]);
  }

  var schema = this.mongooseSchema = new MongooseSchema(properties, _.merge({}, this.options || {}, definition.options));

  NOOT.InternalUtils.buildSuper(schema.methods, this.methods || {}, definition.methods);
  NOOT.InternalUtils.buildSuper(schema.statics, this.statics || {}, definition.statics);

  schema.extend = Schema.extend.bind(schema);

  schema.__nootDef = definition;
  schema.__nootParent = this;

  return schema;
};


/**
 * Parse incoming arguments for find and findOne
 *
 * @param {Object} conditions
 * @param {String} fields
 * @param {Object} options
 * @param {Function} callback
 * @returns {Array}
 */
var parseArguments = function(conditions, fields, options, callback) {
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
    fields = fields + ' __type';
  } else if ('function' !== typeof callback) {
    fields = fields + ' __type';
  }

  if (!conditions) conditions = {};
  if (!options) options = {};
  if (options.strict) conditions.__type = this.modelName;
  else conditions.__types = this.modelName;

  return [conditions, fields, options, callback];
};


/**
 * Override findOne method to handle inheritance and find the right document based on the modelName
 */
Model.findOne = function() {
  return oldFindOne.apply(this, parseArguments.apply(this, arguments));
};


/**
 * Override find method to handle inheritance and find the right documents based on the modelName
 */
Model.find = function() {
  return oldFind.apply(this, parseArguments.apply(this, arguments));
};


/**
 * Set the prototype based on the discriminator __type
 *
 * @param {Object} doc
 * @param {Object} query
 * @param {function} fn
 * @returns {*}
 */
Model.prototype.init = function(doc, query, fn) {
  var model = this.db.model(doc.__type);
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


/**
 * Attach middlewares functions
 */
fs.readdirSync(path.resolve(__dirname, MIDDLEWARES_PATH)).forEach(function(middleware) {
  var middlewareName = Case.camel(path.basename(middleware, '.js'));
  middleware = require(path.join(__dirname, MIDDLEWARES_PATH, middleware));
  MongooseSchema.prototype[middlewareName] = function() {
    var args = NOOT.makeArray(arguments);
    args.unshift(this);
    return middleware.apply(middleware, args);
  };
});


/**
 * Redefine model creation to attach discriminators
 *
 * @param {String} modelName
 * @param {Object} schema
 * @returns {Object}
 */
mongoose.model = function(modelName, schema) {

  if (schema) {

    var definition = schema.__nootDef;

    if (definition) {
      var parent = schema.__nootParent;
      var parentDef = parent.__nootDef;

      definition.parents = [modelName];

      for (var registeredModelName in this.models) {
        if (this.models[registeredModelName].schema === parent) {
          definition.parents.push(registeredModelName);
          break;
        }
      }

      definition.parents = ((parentDef && parentDef.parents) || []).concat(definition.parents);
      definition.parents = _.uniq(definition.parents);

      var identificator = { __type: { type: String, default: modelName } };

      var discriminator = {
        __types: { type: Array, default: function() { return definition.parents; } }
      };

      schema.add(discriminator);
      schema.add(identificator);
    }
  }

  return oldModel.apply(this, arguments);
};


/**
 * @module
 */
module.exports = Schema;