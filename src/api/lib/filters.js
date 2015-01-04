/**
 * Dependencies
 */
var NOOT = require('../../../')('namespace');
var Filter = require('./filter');

/***********************************************************************************************************************
 * @class Filters
 * @static
 * @namespace NOOT.API
 * @extends NOOT.Namespace
 **********************************************************************************************************************/
var Filters = NOOT.Namespace.create({

  /**
   * @property READ
   * @type NOOT.API.Filter
   * @final
   * @static
   * @readOnly
   */
  READ: Filter.create({}),

  /**
   * @property SELECT
   * @type NOOT.API.Filter
   * @final
   * @static
   * @readOnly
   */
  SELECT: Filter.create({}),

  /**
   * @property WRITE
   * @type NOOT.API.Filter
   * @final
   * @static
   * @readOnly
   */
  WRITE: Filter.create({}),

  /**
   * @property SORT
   * @type NOOT.API.Filter
   * @final
   * @static
   * @readOnly
   */
  SORT: Filter.create({}),

  /**
   * @property FILTER
   * @type NOOT.API.Filter
   * @final
   * @static
   * @readOnly
   */
  FILTER: Filter.create({})
});

module.exports = Filters;