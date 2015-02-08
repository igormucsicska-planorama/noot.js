var NumberField = require('./number');


var IntegerField = NumberField.extend({

  parseFromQueryString: function() {
    return parseInt(this.value, 10);
  }

});

module.exports = IntegerField;