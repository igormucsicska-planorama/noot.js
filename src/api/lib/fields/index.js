var NOOT = require('../../../../index')('namespace');

var Fields = NOOT.Namespace.create({
  Number: require('./number'),
  Integer: require('./integer'),
  String: require('./float'),
  Array: require('./array'),
  Date: require('./date'),
  ToOne: require('./to-one'),
  ToMany: require('./to-many'),
  Object: require('./object'),
  Mixed: require('./mixed')
});


module.exports = Fields;