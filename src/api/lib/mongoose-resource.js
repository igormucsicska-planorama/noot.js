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
    var query = stack.query;

    var selectError = stack.filterProperties(query.select, FilterModes.SELECT);
    var filterError = stack.filterProperties(query.filter, FilterModes.FILTER);

    if (selectError || filterError) return stack.next(selectError || filterError);

    return this.model.findOne(query.filter, query.select, function(err, item) {
      if (err) return stack.next(NOOT.Errors.fromMongoose(err));
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
          if (err) return stack.next(NOOT.Errors.fromMongoose(err));
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

    (isMulti ? stack.body : [stack.body]).forEach(function(item) {
      return stack.validateProperties(item, FilterModes.WRITE);
    });

    return this.model.create(stack.body, function(err, items) {
      if (err) return stack.next(NOOT.Errors.fromMongoose(err));
      return stack.setData(items).setStatus(NOOT.HTTP.Created).next();
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
            getReference: function() { return resource && resource.api.resources[referenceName]; }
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

    return FieldClass.extend(options);
  }

});


module.exports = MongooseResource;