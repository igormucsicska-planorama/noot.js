var NOOT = require('../../../')('namespace');

var Utils = NOOT.Namespace.create({

  parseFieldsList: function(str) {
    return (str || '').split(/\s*,\s*/).join(' ') || null;
  },

  makeReadOnly: function(obj, prop, value) {
    return Object.defineProperty(obj, prop, { get: function() { return value; } });
  },

  bubbleProperty: function(context, parentKey, key, options) {
    options = options || {};
    var value = context[key];
    var parent = context[parentKey];
    return !NOOT.isNone(value) ?
      value :
      (parent ?
        parent[options.bubblingKey || key] :
        !NOOT.isNone(value) ? value : !NOOT.isNone(options.default) ? options.default : value);
  }

});


module.exports = Utils;