var NOOT = nootrequire('mongoose');

describe('NOOT.Mongoose', function() {
  it('should require Types', function() {
    NOOT.Mongoose.Types.should.be.an('object');
  });
  it('should require Plugins', function() {
    NOOT.Mongoose.Plugins.should.be.an('object');
  });
});