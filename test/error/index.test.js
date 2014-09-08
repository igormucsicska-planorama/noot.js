var NOOT = nootrequire('error');


describe('NOOT.Error', function() {
  it('should create an instance', function() {
    var inst = new NOOT.Error();
    console.log(inst);
    NOOT.isError(inst).should.equal(true);
  });
});