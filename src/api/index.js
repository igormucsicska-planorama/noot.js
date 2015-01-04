var _ = require('lodash');

module.exports = _.extend(require('./lib/api'), {
  Route: require('./lib/route'),
  Resource: require('./lib/resource'),
  RoutesSorter: require('./lib/routes-sorter'),
  Filter: require('./lib/filter'),
  Filters: require('./lib/filters'),
  Authable: require('./lib/authable'),
  Queryable: require('./lib/queryable'),
  Stack: require('./lib/stack'),
  DefaultRoutes: require('./lib/default-routes'),
  ConditionsParser: require('./lib/conditions-parser')
});