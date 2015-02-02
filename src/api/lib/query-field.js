var NOOT = require('../../../')('object');


var QueryField = NOOT.Object.extend({
  entry: null,

  operator: null,
  property: null,
  value: null,
  separator: '__',
  isEqual: false,

  init: function() {
    NOOT.required(this, 'entry');

    var name = Object.keys(this.entry)[0];
    var split = name.split(this.separator);

    this.property = split[0];
    this.operator = split[1];
    if (!this.operator) this.isEqual = true;
    this.value = this.entry[name];
  }
});


module.exports = QueryField;