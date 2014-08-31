/**
 * Dependencies
 */
var NOOTManager = require('../../lib/noot');


describe('NOOT (manager)', function() {
  describe('._getArguments()', function() {
    it('should return a single level array (strings list)', function() {
      NOOTManager._getArguments('core-object', 'namespace', 'configurator').should
        .deep.equal(['core-object', 'namespace', 'configurator']);
    });
    it('should return a single level array (single array)', function() {
      NOOTManager._getArguments(['core-object', 'namespace', 'configurator']).should
        .deep.equal(['core-object', 'namespace', 'configurator']);
    });
    it('should return a single level array (mixed string and array)', function() {
      NOOTManager._getArguments(['core-object', 'namespace'], 'configurator').should
        .deep.equal(['core-object', 'namespace', 'configurator']);
    });
    it('should return a single level array (mixed string, array and nested array)', function() {
      NOOTManager._getArguments(['core-object', ['namespace']], 'configurator').should
        .deep.equal(['core-object', 'namespace', 'configurator']);
    });
  });

});
