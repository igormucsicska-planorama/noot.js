/**
 * Dependencies
 */
var NOOT = require('../../')('core-object');
var path = require('path');

/***********************************************************************************************************************
 *
 *
 *
 * @class CustomRequire
 * @constructor
 * @namespace NOOT
 **********************************************************************************************************************/
var CustomRequire = NOOT.CoreObject.extend({
  root: null,
  name: null,
  makeGlobal: false,

  /**
   * @constructor
   */
  init: function() {
    if (this.makeGlobal && !this.name) throw new Error('CustomRequire needs a `name`');
    this.root = this.root || process.cwd();
  }

}, {

  /**
   * Create a new instance
   *
   * @returns {NOOT.CustomRequire}
   */
  create: function() {
    var instance = this._super.apply(this, arguments);

    var customrequire = function(moduleName) {
      return require(path.join(instance.root, moduleName));
    };

    if (instance.makeGlobal) global[instance.name] = customrequire;

    return customrequire;
  }

});

/**
 * @exports
 */
module.exports = CustomRequire;