var NOOT = require('../../../')('namespace');
var QueryMode = require('./query-mode');

var QueryModes = NOOT.Namespace.create({
  READ: QueryMode.create({}),
  SELECT: QueryMode.create({}),
  WRITE: QueryMode.create({}),
  SORT: QueryMode.create({}),
  FILTER: QueryMode.create({})
});

module.exports = QueryModes;