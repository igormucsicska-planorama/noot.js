/**
 * Dependencies
 */
var NOOT = require('../../../')('object');


/***********************************************************************************************************************
 * NOOT.Cache
 ***********************************************************************************************************************
 *
 *
 *
 *
 **********************************************************************************************************************/
var Cache = NOOT.Object.extend({
  target: null,
  name: null,
  update: null,
  _value: null,
  init: function() {
    NOOT.required(this, 'target', 'name', 'update');
    this._isAsync = !!this.update.length;
  }
});


/**
 * @module
 */
module.exports = Cache;