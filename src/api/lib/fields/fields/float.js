var NumberField = require('./number');

var FloatField = NumberField.extend({

  parseFromQueryString: function(value) {
    return parseFloat(value);
  }

});

module.exports = FloatField;