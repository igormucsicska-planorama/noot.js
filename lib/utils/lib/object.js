/**
 * Dependencies
 */
var NOOT = require('../../../')('core-object');

/***********************************************************************************************************************
 * NOOT.Utils.Object
 ***********************************************************************************************************************
 *
 *
 *
 *
 **********************************************************************************************************************/
var Obj = NOOT.CoreObject.create({

  /**
   * Rename a property
   *
   * @param obj
   * @param from
   * @param to
   * @returns {*}
   */
  renameProperty: function(obj, from, to) {
    obj[to] = obj[from];
    delete obj[from];
    return obj;
  },

  /**
   * Rename multiple properties
   *
   * @param obj
   * @param map
   */
  renameProperties: function(obj, map) {
    for(var key in map) {
      this.renameProperty(obj, key, map[key]);
    }
  }

});

/**
 * @module
 */
module.exports = Obj;