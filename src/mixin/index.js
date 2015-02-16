var NOOT = require('../../')('object');


var Mixin = NOOT.Object.extend({}, {
  create: function(def) {
    return def;
  },
  extend: null
});


module.exports = Mixin;