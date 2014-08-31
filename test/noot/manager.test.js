/**
 * Dependencies
 */
var NOOTManager = require('../../src/noot/manager');


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

  describe('._resolve()', function() {
    it('should return an object with right module name (core-object)', function() {
      NOOTManager._resolve('core-object').should.contain.key('CoreObject');
    });
    it('should return an object with right module name (coreObject)', function() {
      NOOTManager._resolve('coreObject').should.contain.key('CoreObject');
    });
    it('should return an object with right module name (CoreObject)', function() {
      NOOTManager._resolve('CoreObject').should.contain.key('CoreObject');
    });
    it('should recognize irregular namespace name (REST)', function() {
      NOOTManager._resolve('REST').should.contain.key('REST');
    });
    it('should recognize irregular namespace name (Rest)', function() {
      NOOTManager._resolve('Rest').should.contain.key('REST');
    });
    it('should recognize irregular namespace name (rest)', function() {
      NOOTManager._resolve('rest').should.contain.key('REST');
    });
    it('should ignore nested module name (slash)', function() {
      NOOTManager._resolve('rest/resource').REST.should.contain.keys(['Resource', 'Response']);
    });
    it('should ignore nested module name (dot)', function() {
      NOOTManager._resolve('rest.resource').REST.should.contain.keys(['Resource', 'Response']);
    });
  });

  describe('.require()', function() {
    it('should build an object containing the desired dependencies (and no others)', function() {
      NOOTManager.require('core-object', 'namespace').should.have.keys(['CoreObject', 'Namespace']);
    });
  });

});
