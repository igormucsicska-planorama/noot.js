/**
 * Dependencies
 */
var NOOT = require('../../../index')('http', 'errors');
var _ = require('lodash');
var Inflector = require('inflected');

var MongoResource = require('./mongo-resource');
var FilterModes = require('./filter-modes');
var Fields = require('./fields');


/***********************************************************************************************************************
 * @class MongooseResource
 * @extends NOOT.API.MongoResource
 * @constructor
 * @namespace NOOT.API
 **********************************************************************************************************************/
var MongooseResource = MongoResource.extend({

  /**
   *
   */
  model: null,

  /**
   *
   */
  init: function() {
    NOOT.required(this, 'model');
    this.path = this.path || NOOT.dasherize(Inflector.pluralize(this.model.modelName));
    this._super();
  },

  /**
   *
   *
   *
   * @param {NOOT.API.Stack} stack
   */
  get: function(stack) {
    return this.model.findOne({ _id: stack.primaryKey }, stack.query.select, function(err, item) {
      if (err) return stack.next(NOOT.Errors.fromMongooseError(err));
      if (!item) return stack.next(new NOOT.Errors.NotFound());
      return stack.setData(item).setStatus(NOOT.HTTP.OK).next();
    });
  },

  /**
   *
   *
   *
   * @param {NOOT.API.Stack} stack
   */
  getMany: function(stack) {
    var self = this;
    var query = stack.query;
    return this.model
      .find(query.filter, query.select)
      .sort(query.sort)
      .skip(query.offset)
      .limit(query.limit)
      .exec(function(err, items) {
        if (err) return stack.next(err);
        return self.getCount(query.filter, function(err, count) {
          if (err) return stack.next(NOOT.Errors.fromMongooseError(err));
          return stack.createManyMeta(count).setData(items).setStatus(NOOT.HTTP.OK).next();
        });
      });
  },

  /**
   *
   *
   *
   * @param stack
   * @returns {*}
   */
  create: function(stack) {
    var isMulti = NOOT.isArray(stack.body);

    if (isMulti && !_.contains(this.manyMethods, 'post')) {
      return stack.next(new NOOT.Errors.Forbidden('This resource does not allow multiple `POST` at a time'));
    }

    return this.model.create(stack.body, function(err, items) {
      if (err) return stack.next(NOOT.Errors.fromMongooseError(err));
      return stack.setData(items).setStatus(NOOT.HTTP.Created).next();
    });
  },

  /**
   *
   *
   * @param stack
   * @returns {*}
   */
  update: function(stack) {
    return this.model.update({ _id: stack.primaryKey }, { $set: stack.body }, function(err, count) {
      if (err) return stack.next(NOOT.Errors.fromMongooseError(err));
      return stack.pushMessage('Successfully updated', count, 'item').setStatus(NOOT.HTTP.NoContent).next();
    });
  },

  /**
   *
   *
   * @param stack
   * @returns {*}
   */
  updateMany: function(stack) {
    if (!_.contains(this.manyMethods, 'patch')) {
      return stack.next(new NOOT.Errors.Forbidden('This resource does not allow multiple `PATCH` at a time'));
    }

    return this.model.update(stack.query.filter, { $set: stack.body }, { multi: true }, function(err, count) {
      if (err) return stack.next(NOOT.Errors.fromMongooseError(err));
      return stack.pushMessage('Successfully updated', count, 'item(s)').setStatus(NOOT.HTTP.NoContent).next();
    });
  },

  /**
   *
   *
   * @param stack
   * @returns {*}
   */
  delete: function(stack) {
    return this.model.remove({ _id: stack.primaryKey }, function(err, count) {
      if (err) return stack.next(NOOT.Errors.fromMongooseError(err));
      return stack.pushMessage('Successfully removed', count, 'item').setStatus(NOOT.HTTP.NoContent).next();
    });
  },

  /**
   *
   *
   * @param {NOOT.API.Stack} stack
   */
  deleteMany: function(stack) {
    if (!_.contains(this.manyMethods, 'delete')) {
      return stack.next(new NOOT.Errors.Forbidden('This resource does not allow multiple `DELETE` at a time'));
    }
    return this.model.remove(stack.query.filter, function(err, count) {
      if (err) return stack.next(NOOT.Errors.fromMongooseError(err));
      return stack.pushMessage('Successfully removed', count, 'item(s)').setStatus(NOOT.HTTP.NoContent).next();
    });
  },

  upsert: function(stack) {
    var self = this;
    return this.model.findOne(stack.query.filter, function(err, existing) {
      if (err) return stack.next(NOOT.Errors.fromMongooseError(err));
      if (existing) return self.updateMany(stack);
      return self.create(stack);
    });
  },

  /**
   *
   *
   * @param filter
   * @param callback
   * @returns {*}
   */
  getCount: function(filter, callback) {
    return this.model.count(filter, callback);
  },

  /**
   * Unlike for base NOOT.API.Resource class, this method will build the resource's fields based on
   *
   * @method getFields
   * @return {Object}
   */
  getFields: function() {
    var ret = {};

    var paths = this.model.schema.paths;

    for (var pathName in paths) {
      ret[pathName] = this.constructor.toAPIField(paths[pathName], this);
    }

    return ret;
  }

}, {

  toAPIField: function(mongoosePath, resource) {
    var options = {
      path: mongoosePath.path,
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

      default:
        throw new Error('Unsupported `instance`: ' + instance);

    }

    return FieldClass.create(options);
  }

});


module.exports = MongooseResource;