var NOOTManager = nootrequire();

describe('NOOTManager', function() {

  describe('.require()', function() {
    it('should require NOOT module', function() {
      NOOTManager.require('utils').should.have.keys(['Url', 'Time', 'Object']);
    });
  });

  describe('._getModuleName()', function() {
    it('should parse module name', function(){
      [
        { before: 'utils', after: 'Utils' },
        { before: 'core-object', after: 'CoreObject' },
        { before: 'CoreObject', after: 'CoreObject' },
        { before: 'coreObject', after: 'CoreObject' },
        { before: 'logger', after: 'Logger' },
        { before: 'configurator', after: 'Configurator' },
        { before: 'Dash-er-ized', after: 'DashErIzed' }
      ].forEach(function(config) {
          NOOTManager._getModuleName(config.before).should.equal(config.after);
        });
    });
  });

  describe('._getModulePath()', function() {
    it('should parse module path', function(){
      [
        { before: 'utils', after: 'utils' },
        { before: 'core-object', after: 'core-object' },
        { before: 'CoreObject', after: 'core-object' },
        { before: 'coreObject', after: 'core-object' },
        { before: 'logger', after: 'logger' },
        { before: 'Configurator', after: 'configurator' },
        { before: 'Dash-er-ized', after: 'dash-er-ized' }
      ].forEach(function(config) {
          NOOTManager._getModulePath(config.before).should.equal(NOOTManager._LIB_PATH + config.after);
        });
    });
  });

  describe('._buildDependencies()', function() {
    it('should build a "dependencies object" (list of strings)', function() {
      var dependencies = NOOTManager._buildDependencies('core-object', 'Utils', 'logger');
      dependencies.should.have.keys(['CoreObject', 'Utils', 'Logger']);
    });
    it('should build a "dependencies object" (array)', function() {
      var dependencies = NOOTManager._buildDependencies(['core-object', 'Utils', 'logger']);
      dependencies.should.have.keys(['CoreObject', 'Utils', 'Logger']);
    });
    it('should build a "dependencies object" (mixed array and strings)', function() {
      var dependencies = NOOTManager._buildDependencies(['core-object', 'Utils'], 'logger');
      dependencies.should.have.keys(['CoreObject', 'Utils', 'Logger']);
    });
    it('should get NOOTManager', function() {
      NOOTManager._buildDependencies().should.equal(NOOTManager);
    });
  });

});