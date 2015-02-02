var _ = require('lodash');

module.exports = _.extend(require('./lib/api'), {
  Route: require('./lib/route'),

  Resource: require('./lib/resource'),

  MongooseResource: require('./lib/mongoose-resource'),
  MongoNativeResource: require('./lib/mongo-native-resource'),
  StaticResource: require('./lib/static-resource'),
  S3Resource: require('./lib/s3-resource'),

  RoutesSorter: require('./lib/routes-sorter'),
  FilterModes: require('./lib/filter-modes'),
  Authable: require('./lib/interfaces/authable'),
  Stack: require('./lib/stack'),
  DefaultRoutes: require('./lib/default-routes'),
  ConditionsParser: require('./lib/conditions-parser'),

  Field: require('./lib/fields/lib/field'),
  Fields: require('./lib/fields')
});