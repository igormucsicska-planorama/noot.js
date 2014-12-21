var NOOT = require('../../')('namespace');

var Cache = NOOT.Namespace.create({
  Expirable: require('./lib/expirable')
});

module.exports = Cache;