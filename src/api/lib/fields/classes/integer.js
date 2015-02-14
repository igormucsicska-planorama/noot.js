var NumberField = require('./number');


var IntegerField = NumberField.extend({

  parseFromQueryString: function(value) {
    return parseInt(value, 10);
  }

});

module.exports = IntegerField;