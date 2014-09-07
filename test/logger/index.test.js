var NOOT = nootrequire('logger');


describe('NOOT.Logger', function() {

  describe('.setLevel()', function() {
    var logger = NOOT.Logger.create({ level: 'trace' });

    it('should throw an error if no `level` is set', function() {
      (function() { logger.setLevel(); }).should.throw(/Missing logging level/);
    });
    it('should throw an error if no `level` is set (empty string)', function() {
      (function() { logger.setLevel(''); }).should.throw(/Missing logging level/);
    });
    it('should throw an error if `level` is invalid', function() {
      (function() { logger.setLevel('invalid'); }).should.throw(/Invalid logging level/);
    });
    it('should set level by name', function() {
      logger.setLevel('debug');
      logger.level.should.equal(NOOT.Logger.levels.DEBUG);
    });
    it('should set level by number', function() {
      logger.setLevel(0);
      logger.level.should.equal(NOOT.Logger.levels.TRACE);
    });
  });

  describe('.setStyles()', function() {
    var logger = NOOT.Logger.create({ level: 'trace' });

    it('should set color for `trace` (by direct string)', function() {
      logger.setStyles({ trace: 'white' });
      logger._styles.trace.should.deep.equal({ color: 'white' });
    });
    it('should set color for `trace` (by object)', function() {
      logger.setStyles({ trace: { color: 'grey' } });
      logger._styles.trace.should.deep.equal({ color: 'grey' });
    });
    it('should set `underline` style option for `verbose`', function() {
      logger.setStyles({ verbose: { underline: true } });
      logger._styles.verbose.should.deep.equal({ color: 'cyan', underline: true, bold: true });
    });
    it('should unset `underline` style option for `verbose`', function() {
      logger.setStyles({ verbose: { underline: false } });
      logger._styles.verbose.should.deep.equal({ color: 'cyan', bold: true });
    });
  });

  describe('To log or not to log', function() {
//    var logger = NOOT.Logger.create({
//      level: 'trace',
//      transport: function() {
//
//      }
//    });
  });

});