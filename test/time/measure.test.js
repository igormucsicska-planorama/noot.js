var NOOT = nootrequire('time');

describe('NOOT.Time.Measure', function() {

  describe('.create()', function() {
    it('should create an instance', function() {
      var measure = NOOT.Time.Measure.create();
      measure.should.be.an('object');
    });
  });

  describe('.start()', function() {
    it('.start() should return `hrtime` array', function() {
      var measure = NOOT.Time.Measure.create();
      measure.start().should.be.an('array').and.have.lengthOf(2);
      measure.stop();
    });
  });

  describe('.stop()', function() {
    it('.stop() should return `hrtime` array', function() {
      var measure = NOOT.Time.Measure.create();
      measure.start();
      measure.stop().should.be.an('array').and.have.lengthOf(2);
    });
  });

  describe('Measure and conversion', function() {
    it('should get nanoseconds', function() {
      var measure = NOOT.Time.Measure.create();
      measure.start();
      var elapsedHrTime = measure.stop();
      measure.getNanoSeconds().should.equal(elapsedHrTime[0] * 1e9 + elapsedHrTime[1]);
    });
    it('should convert to microseconds', function() {
      var measure = NOOT.Time.Measure.create();
      measure.start();
      measure.stop();
      measure.getMicroSeconds().should.equal(measure._elapsed / 1e3);
    });
    it('should convert to milliseconds', function() {
      var measure = NOOT.Time.Measure.create();
      measure.start();
      measure.stop();
      measure.getMilliSeconds().should.equal(measure._elapsed / 1e6);
    });
    it('should convert to seconds', function() {
      var measure = NOOT.Time.Measure.create();
      measure.start();
      measure.stop();
      measure.getSeconds().should.equal(measure._elapsed / 1e9);
    });
    it('should not round', function() {
      var measure = NOOT.Time.Measure.create();
      measure.start();
      measure.stop();
      measure.getMilliSeconds().should.not.equal(0);
    });
    it('should round', function() {
      var measure = NOOT.Time.Measure.create();
      measure.start();
      measure.stop();
      measure.getMilliSeconds(true).should.equal(0);
    });
    it('should measure interval', function(done) {
      var measure = NOOT.Time.Measure.create();
      var duration = NOOT.Time.SECOND * 1.3;
      var delta = 5;
      measure.start();
      setTimeout(function() {
        measure.stop();
        measure.getMilliSeconds(true).should.be.within(duration, duration + delta);
        return done();
      }, duration);
    });
  });

});