var _ = require('lodash');
var NOOT = {
  Namespace: require('../namespace')
};

var Utils = NOOT.Namespace.create({
  makeArray: function(arg) {
    return Array.isArray(arg) ? arg : Array.prototype.slice.call(arg, 0);
  }
});


module.exports = _.extend(Utils, {
  Time: require('./lib/time'),
  Url: require('./lib/url'),
  Object: require('./lib/object')
});