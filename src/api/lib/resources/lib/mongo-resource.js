var NOOT = require('../../../../../index')();


var Resource = require('./resource');



var MongoResource = Resource.extend({

  parseQueryFilter: function(stack, callback) {
    callback = callback || stack.next;

    return this._super(stack, function(err) {
      if (err) return callback(err);

      var filter = stack.query.filter;

      for (var path in filter) {
        var pathFilter = filter[path];
        if (NOOT.isPlainObject(pathFilter)) {
          for (var operator in pathFilter) {
            NOOT.renameProperty(pathFilter, operator, MongoResource.toMongoOperator(operator));
          }
        }
      }

      return callback();
    });
  },

  parseQuerySelect: function(stack, callback) {
    var self = this;
    callback = callback || stack.next;
    this._super(stack, function(err) {
      if (err) return callback(err);
      stack.query.select = self.constructor.toMongoSelectOrSort(stack.query.select);
      return callback();
    });
  },

  parseQuerySort: function(stack, callback) {
    var self = this;
    callback = callback || stack.next;
    this._super(stack, function(err) {
      if (err) return callback(err);
      stack.query.sort = self.constructor.toMongoSelectOrSort(stack.query.sort);
      return callback();
    });
  }

}, {

  toMongoSelectOrSort: function(arr) {
    var self = this;
    var ret = {};
    if (!arr) return ret;
    arr.forEach(function(fieldName) {
      var shouldExclude = fieldName[0] === self.EXCLUSION_CHARACTER;
      fieldName = fieldName.replace(new RegExp('^' + self.EXCLUSION_CHARACTER), '');
      ret[fieldName] = shouldExclude ? -1 : 1;
    });
    return ret;
  },

  toMongoOperator: function(operator) {
    return '$' + operator;
  }

});


module.exports = MongoResource;