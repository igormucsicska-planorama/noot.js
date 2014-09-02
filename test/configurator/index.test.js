var NOOT = nootrequire('configurator');
var path = require('path');

var configurator = NOOT.Configurator.create({
  env: 'test',
  directory: path.join(process.cwd(), 'test/configurator/config')
});

var config = configurator.get('config');

describe('NOOT.Configurator', function() {
  it('should have retrieved config', function() {
    config.should.exist.and.be.an.object;
  });
  it('should have merged arrays', function() {
    config.tasks.should.deep.equal(['say-hello', 'keep-alive', 'do-some-stuff', 'do-something-else', 'test-task']);
  });
//  it('should have merged objects', function() {
//    config.mongo.should.have.keys(['name', 'host', 'port']);
//  });
});