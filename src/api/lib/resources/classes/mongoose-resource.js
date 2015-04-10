/**
 * Dependencies
 */
var NOOT = require('../../../../../index')('http', 'errors');
var _ = require('lodash');
var Inflector = require('inflected');
var mongoose = require('mongoose');

var MongoResource = require('./../lib/mongo-resource');
var Fields = require('./../../fields/index');
var Field = require('./../../fields/lib/field');


/***********************************************************************************************************************
 * @class MongooseResource
 * @extends NOOT.API.MongoResource
 * @constructor
 * @namespace NOOT.API
 **********************************************************************************************************************/
var MongooseResource = MongoResource.extend({

  /**
   * @property model
   * @type mongoose.model
   */
  model: null,

  /**
   * Constructor
   */
  init: function() {
    NOOT.required(this, 'model');
    this.path = this.path || NOOT.dasherize(Inflector.pluralize(this.model.modelName));
    this._super();
  },

  /**
   * Get a single item from MongoDB.
   *
   * @method get
   * @param {NOOT.API.Stack} stack
   * @param {Function} callback
   */
  get: function(stack, callback) {
    callback = callback || stack.next;
    return this.model.findOne({ _id: stack.primaryKey }, stack.query.select, function(err, item) {
      if (err) return callback(NOOT.Errors.fromMongooseError(err));
      if (!item) return callback(new NOOT.Errors.NotFound());
      stack.setData(item).setStatus(NOOT.HTTP.OK);
      return callback();
    });
  },

  /**
   * Get multiple items from MongoDB.
   *
   * @method getMany
   * @param {NOOT.API.Stack} stack
   * @param {Function} callback
   */
  getMany: function(stack, callback) {
    var self = this;
    var query = stack.query;
    callback = callback || stack.next;

    return this.model
      .find(query.filter, query.select)
      .sort(query.sort)
      .skip(query.offset)
      .limit(query.limit)
      .exec(function(err, items) {
        if (err) return callback(err);
        return self.getCount(query.filter, function(err, count) {
          if (err) return callback(NOOT.Errors.fromMongooseError(err));
          stack.createManyMeta(count).setData(items).setStatus(NOOT.HTTP.OK);
          return callback();
        });
      });
  },

  /**
   * Write item(s) to MongoDB.
   *
   * @method create
   * @param {NOOT.API.Stack} stack
   * @param {Function} callback
   */
  create: function(stack, callback) {
    callback = callback || stack.next;
    var isMultiple = NOOT.isArray(stack.body);
    return this.model.create(stack.body, function(err, items) {
      if (err) return callback(NOOT.Errors.fromMongooseError(err));
      if (isMultiple && !Array.isArray(items)) items = NOOT.makeArray(arguments).slice(1);
      stack.setData(items).setStatus(NOOT.HTTP.Created);
      return callback();
    });
  },

  /**
   * Update a single item in MongoDB.
   *
   * @method update
   * @param {NOOT.API.Stack} stack
   * @param {Function} callback
   *
   *
   */
  update: function(stack, callback) {
    // TODO use messages provider
    callback = callback || stack.next;
    return this.model.update({ _id: stack.primaryKey }, { $set: stack.body }, function(err, count) {
      if (err) return callback(NOOT.Errors.fromMongooseError(err));
      stack.pushMessage('Successfully updated', count, 'item').setStatus(NOOT.HTTP.NoContent);
      return callback();
    });
  },

  /**
   * Update multiple items in MongoDB.
   *
   * @method updateMany
   * @param {NOOT.API.Stack} stack
   * @param {Function} callback
   */
  updateMany: function(stack, callback) {
    // TODO use messages provider
    callback = callback || stack.next;
    return this.model.update(stack.query.filter, { $set: stack.body }, { multi: true }, function(err, count) {
      if (err) return callback(NOOT.Errors.fromMongooseError(err));
      stack.pushMessage('Successfully updated', count, 'item(s)').setStatus(NOOT.HTTP.NoContent);
      return callback();
    });
  },

  /**
   * Delete a single item in MongoDB.
   *
   * @method delete
   * @param {NOOT.API.Stack} stack
   * @param {Function} callback
   */
  delete: function(stack, callback) {
    // TODO use messages provider
    callback = callback || stack.next;
    return this.model.remove({ _id: stack.primaryKey }, function(err, count) {
      if (err) return callback(NOOT.Errors.fromMongooseError(err));
      stack.pushMessage('Successfully removed', count, 'item').setStatus(NOOT.HTTP.NoContent);
      return callback();
    });
  },

  /**
   * Delete multiple items in MongoDB.
   *
   * @method deleteMany
   * @param {NOOT.API.Stack} stack
   * @param {Function} callback
   */
  deleteMany: function(stack, callback) {
    // TODO use messages provider
    callback = callback || stack.next;
    return this.model.remove(stack.query.filter, function(err, count) {
      if (err) return callback(NOOT.Errors.fromMongooseError(err));
      stack.pushMessage('Successfully removed', count, 'item(s)').setStatus(NOOT.HTTP.NoContent);
      return callback();
    });
  },

  /**
   * Upsert an item in MongoDB.
   *
   * @method upsert
   * @param {NOOT.API.Stack} stack
   * @param {Function} callback
   */
  upsert: function(stack, callback) {
    var self = this;
    callback = callback || stack.next;
    return this.model.findOne(stack.query.filter, function(err, existing) {
      if (err) return callback(NOOT.Errors.fromMongooseError(err));
      if (existing) return self.updateMany(stack, callback);
      return self.create(stack, callback);
    });
  },

  /**
   *
   * @method getCount
   * @param {Object} filter
   * @param {Function} callback
   */
  getCount: function(filter, callback) {
    return this.model.count(filter, callback);
  },

  /**
   * Builds a list of fields based on the `model`'s mongoose schema.
   *
   * @method getFields
   * @param {Object} [schema]
   * @param {String} [parentPath]
   * @return {Object}
   */
  getFields: function(schema, parentPath) {
    schema = schema || this.model.schema;
    parentPath = parentPath || '';

    var ret = {};
    var paths = schema.paths;

    for (var pathName in paths) {
      var mongoosePath = paths[pathName];

      if (mongoosePath.schema) {
        _.extend(ret, this.getFields(mongoosePath.schema, Field.appendWildcardToPath(parentPath + pathName)));
      } else {
        ret[parentPath + pathName] = this.constructor.toAPIField(paths[pathName], this, parentPath);
      }
    }

    return ret;
  }

}, {
  /**
   * Transforms a mongoose schema property to a NOOT compatible one.
   *
   * @method toAPIField
   * @static
   * @param {Object} mongoosePath
   * @param {NOOT.API.Resource} resource
   * @param {String} [parentPath]
   * @return {NOOT.API.Field}
   */
  toAPIField: function(mongoosePath, resource, parentPath) {
    var path = (parentPath ? parentPath : '') + mongoosePath.path;
    var options = {
      path: path,
      isRequired: !!mongoosePath.isRequired
    };

    var FieldClass;
    var instance = mongoosePath.instance ||
      (mongoosePath.caster && mongoosePath.caster.instance) ||
      (mongoosePath.options && mongoosePath.options.type);

    switch (instance) {

      case 'String':
        FieldClass = Fields.String;
        break;

      case 'ObjectID':
        FieldClass = Fields.String;
        var isReferenceArray = false;
        var referenceName = mongoosePath.options.ref;
        if (!referenceName && mongoosePath.caster && mongoosePath.caster.options.ref) {
          isReferenceArray = true;
          referenceName = mongoosePath.caster.options.ref;
        }
        if (referenceName) {
          _.extend(options, {
            isReference: !isReferenceArray,
            isReferenceArray: isReferenceArray,
            get reference() { return resource && resource.api.resources[referenceName]; }
          });
        }
        break;

      case 'Number':
        FieldClass = Fields.Number;
        break;

      case Date:
        FieldClass = Fields.Date;
        break;

      case Boolean:
        FieldClass = Fields.Boolean;
        break;

      case mongoose.Schema.Types.Mixed:
        FieldClass = Fields.Any;
        break;

      default:
        throw new Error('Unsupported `instance`: ' + instance);

    }

    return FieldClass.create(options);
  }

});


module.exports = MongooseResource;