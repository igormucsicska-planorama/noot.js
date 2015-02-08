var NumberField = require('./number');

var FloatField = NumberField.extend({

  parseFromQueryString: function() {
    return parseFloat(this.value);
  }

});

module.exports = FloatField;