var NOOT = nootrequire('cache', 'time');


describe('NOOT.Cache.Expirable', function() {

  it('should create a cache (sync update)', function() {
    var instance = { myProperty: 50 };

    NOOT.Cache.Expirable.create({
      target: instance,
      name: 'myProperty',
      duration: NOOT.Time.SECOND,
      update: function() {
        return Math.random();
      }
    });

    var firstValue = instance.myProperty;
    instance.myProperty.should.eql(firstValue);

    setTimeout(function() {
      instance.myProperty.should.not.eql(firstValue);
    }, NOOT.Time.SECOND * 1.5);
  });

  it('should create a cache (async update)', function(done) {
    var instance = { myProperty: 50 };

    NOOT.Cache.Expirable.create({
      target: instance,
      name: 'myProperty',
      duration: NOOT.Time.SECOND,
      update: function(callback) {
        return callback(null,  Math.random());
      }
    });

    var firstValue = instance.myProperty;
    instance.myProperty.should.eql(firstValue);

    setTimeout(function() {
      instance.myProperty.should.not.eql(firstValue);
      return done();
    }, NOOT.Time.SECOND * 1.5);
  });


});