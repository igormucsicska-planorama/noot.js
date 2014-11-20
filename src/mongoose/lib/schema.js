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

var MIDDLEWARES_PATH = './middlewares';

var oldFindOne = Model.findOne;
var oldFind = Model.find;
var oldInit = Model.prototype.init;
var oldModel = mongoose.model;


/**
 * Extend schema, define discriminator, create model
 *
 * @param {Object} definition Schema properties
 * @param {Object} [ownStatics] Schema static properties
 * @returns {MongooseSchema}
 */

MongooseSchema.extend = function(definition, ownStatics) {

  definition = definition || {};

  if (_.isUndefined(definition.schema)) definition.schema = {};

  var properties = definition.schema;
  var parentProperties = (this.__nootDef && this.__nootDef.schema) || {};
  for (var key in parentProperties) {
    if (NOOT.isUndefined(properties[key])) properties[key] = _.cloneDeep(parentProperties[key]);
  }

  var schema = new MongooseSchema(properties, _.merge({}, this.options || {}, definition.options));

  NOOT.InternalUtils.buildSuper(schema.methods, this.methods || {}, definition.methods);
  NOOT.InternalUtils.buildSuper(schema.statics, this.statics || {}, definition.statics);
  NOOT.InternalUtils.buildSuper(schema, this, ownStatics);
  
  for (var virtual in this.virtuals) {
    if (NOOT.isUndefined(schema.virtuals[virtual])) schema.virtuals[virtual] = this.virtuals[virtual];
  }

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
    fields = fields + ' __t';
  } else if ('function' !== typeof callback) {
    fields = fields + ' __t';
  }

  if (!conditions) conditions = {};
  if (!options) options = {};

  if (!_.isEmpty(this.schema.__nootDef.parents)) {
    if (options.strict) conditions.__t = this.modelName;
    else conditions.__ts = this.modelName;
  } else {
    if (options.strict) conditions.__t = { $exists : false };
  }
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
 * Set the prototype based on the discriminator __t
 *
 * @param {Object} doc
 * @param {Object} query
 * @param {function} fn
 * @returns {*}
 */

Model.prototype.init = function(doc, query, fn) {
  if (doc.__t) {
    var model = this.db.model(doc.__t);
    var newFn = function() {
      process.nextTick(function() {
        fn.apply(this, arguments);
      });
    };
    this.schema = model.schema;
    var obj = oldInit.call(this, doc, query, newFn);
    obj.__proto__ = model.prototype;
    return obj;
  }

  return oldInit.apply(this, arguments);

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

    var definition = {};
    definition.parents = [];

    if (schema.__nootDef) {
      var parent = schema.__nootParent;
      var parentDef = parent.__nootDef;

      for (var registeredModelName in this.models) {
        if (this.models[registeredModelName].schema === parent) {
          definition.parents = [registeredModelName];
          break;
        }
      }

      definition.parents = ((parentDef && parentDef.parents) || []).concat(definition.parents);
      schema.__nootDef.parents = _.cloneDeep(definition.parents);
      definition.parents.push(modelName);

      var identificator = { __t: { type: String, default: modelName } };
      var discriminator = {
        __ts: { type: Array, default: function() { return definition.parents; } }
      };

      if (!_.isEmpty(schema.__nootDef.parents)) {
        schema.add(discriminator);
        schema.add(identificator);
      }
    }
  }

  return oldModel.apply(this, arguments);
};


/**
 * @module
 */
module.exports = MongooseSchema;