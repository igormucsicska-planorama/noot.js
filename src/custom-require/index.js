/**
 * Dependencies
 */
var NOOT = require('../../')('core-object');
var path = require('path');


var CustomRequire = NOOT.CoreObject.extend({
  root: null,
  name: null,
  makeGlobal: false,

  init: function() {
    if (this.makeGlobal && !this.name) throw new Error('CustomRequire needs a `name`');
    this.root = this.root || process.cwd();
  }
}, {
  create: function() {
    var instance = this._super.apply(this, arguments);

    var customrequire = function(moduleName) {
      return require(path.join(instance.root, moduleName));
    };

    if (instance.makeGlobal) global[instance.name] = customrequire;

    return customrequire;
  }
});

module.exports = CustomRequire;