/**
 * Dependencies
 */
var NOOT = nootrequire('configurator');
var path = require('path');

var configurator = NOOT.Configurator.create({
  env: 'test',
  directory: path.join(process.cwd(), 'test/configurator/config')
});

var config = configurator.get('config');

describe('NOOT.Configurator', function() {

  describe('.get()', function() {
    it('should have retrieved config', function() {
      config.should.exist.and.be.a('object');
    });
    it('should have merged arrays', function() {
      config.tasks.should.deep.equal(['say-hello', 'keep-alive', 'do-some-stuff', 'do-something-else', 'test-task']);
    });
    it('should have merged objects', function() {
      config.mongo.should.have.keys(['name', 'host', 'port']);
    });
    it('should have override property', function() {
      config.port.should.equal(8889);
    });
    it('should have included property from env', function() {
      config.isTest.should.equal(true);
    });
    it('should have included property from all', function() {
      config.isForAll.should.equal(true);
    });
    it('should get nested property (1 level)', function() {
      configurator.get('config', 'port').should.equal(8889);
    });
    it('should get nested property (2 level)', function() {
      configurator.get('config', 'mongo', 'name').should.equal('test');
    });
    it('should throw an error if config does not exist', function() {
      (function() { configurator.get('unknown'); }).should.throw(/Could not load configuration : unknown/);
    });
  });

});