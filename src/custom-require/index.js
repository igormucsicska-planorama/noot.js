/**
 * Dependencies
 */
var NOOT = require('../../')('core-object');
var path = require('path');


var CustomRequire = NOOT.CoreObject.extend({
  rootDirectory: null,
  name: null,
  global: false,

  init: function() {
    if (!this.name) throw new Error('CustomRequire needs a `name`');
    console.log(this.rootDirectory);
    this.rootDirectory = this.rootDirectory || process.cwd();
  }
}, {
  create: function() {
    var instance = this._super.apply(this, arguments);

    var customrequire = function(moduleName) {
      return require(path.join(instance.rootDirectory, moduleName));
    };

    if (instance.global) global[instance.name] = customrequire;

    return customrequire;
  }
});

module.exports = CustomRequire;