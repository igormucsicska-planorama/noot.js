/**
 * Dependencies
 */
var _ = require('lodash');

module.exports = _.extend(require('./lib/api'), {
  Resource: require('./lib/resources/lib/resource'),
  MongoResource: require('./lib/resources/lib/mongo-resource'),
  MongooseResource: require('./lib/resources/classes/mongoose-resource'),

  Route: require('./lib/route'),
  DefaultRoutes: require('./lib/default-routes'),

  Stack: require('./lib/stack'),

  Authable: require('./lib/mixins/authable'),
  Queryable: require('./lib/mixins/queryable'),

  RoutesSorter: require('./lib/routes-sorter'),
  FilterModes: require('./lib/filter-modes'),

  Field: require('./lib/fields/lib/field'),
  Fields: require('./lib/fields'),

  Operator: require('./lib/operators/lib/operator'),
  ListOperator: require('./lib/operators/lib/list-operator'),
  Operators: require('./lib/operators'),

  MessagesProvider: require('./lib/messages-provider')
});