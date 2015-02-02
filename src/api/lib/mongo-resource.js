var NOOT = require('../../../index')();


var Resource = require('./resource');
var _ = require('lodash');



var MongoResource = Resource.extend({


}, {

  parseFilter: function(filter) {
    var self = this;
    var groupedByProperty = _.groupBy(this._super(filter), 'property');

    var ret = {};

    for (var property in groupedByProperty) {

      var fields = groupedByProperty[property];
      var equalityField = _.find(fields, { isEqual: true });
      if (equalityField) {
        ret[property] = equalityField.value;
      } else {
        ret[property] = {};
        fields.forEach(function(field) {
          ret[property][self.parseOperator(field.operator)] = field.value;
        });
      }

    }

    console.log(ret);

    return ret;
  },

  parseOperator: function(operator) {
    return '$' + operator;
  }

});


module.exports = MongoResource;