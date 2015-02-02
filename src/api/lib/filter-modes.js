/**
 * Dependencies
 */
var NOOT = require('../../../')('enum');

/***********************************************************************************************************************
 * @class FilterModes
 * @static
 * @namespace NOOT.API
 * @extends NOOT.Enum
 **********************************************************************************************************************/
var FilterModes = NOOT.Enum.create({

  /**
   * @property READ
   * @type NOOT.API.Filter
   * @final
   * @static
   * @readOnly
   */
  READ: 'read',

  /**
   * @property SELECT
   * @type NOOT.API.Filter
   * @final
   * @static
   * @readOnly
   */
  SELECT: 'select',

  /**
   * @property WRITE
   * @type NOOT.API.Filter
   * @final
   * @static
   * @readOnly
   */
  WRITE: 'write',

  /**
   * @property SORT
   * @type NOOT.API.Filter
   * @final
   * @static
   * @readOnly
   */
  SORT: 'sort',

  /**
   * @property MATCH
   * @type NOOT.API.Filter
   * @final
   * @static
   * @readOnly
   */
  FILTER: 'filter'

});


/**
 * @exports
 */
module.exports = FilterModes;