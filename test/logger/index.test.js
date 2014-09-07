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
    it('should throw an error if `level` is invalid (not number neither string)', function() {
      (function() { logger.setLevel([]); }).should.throw(/Invalid logging level/);
    });
    it('should set level by name', function() {
      logger.setLevel('debug');
      logger._level.should.equal(NOOT.Logger.levels.DEBUG);
    });
    it('should set level by number', function() {
      logger.setLevel(0);
      logger._level.should.equal(NOOT.Logger.levels.TRACE);
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
    it('should set `underline` style option for `announce`', function() {
      logger.setStyles({ announce: { underline: true } });
      logger._styles.announce.should.deep.equal({ color: 'cyan', underline: true, bold: true });
    });
    it('should unset `underline` style option for `announce`', function() {
      logger.setStyles({ announce: { underline: false } });
      logger._styles.announce.should.deep.equal({ color: 'cyan', bold: true });
    });
  });

  describe('._joinMessages()', function() {
    var messageToTest = null;

    var logger = NOOT.Logger.create({
      level: 'trace',
      transport: function(message) {
        messageToTest = message;
      }
    });

    it('should log an undefined value', function() {
      logger.debug(undefined);
      messageToTest.should.equal('undefined');
    });
    it('should log a null value', function() {
      logger.debug(null);
      messageToTest.should.equal('null');
    });
    it('should log a string', function() {
      logger.debug('message');
      messageToTest.should.equal('message');
    });
    it('should log a boolean', function() {
      logger.debug(true);
      messageToTest.should.equal('true');
    });
    it('should log a number', function() {
      logger.debug(1234);
      messageToTest.should.equal('1234');
    });
    it('should log an error with stack trace' , function() {
      var error = new Error('This is an error');
      logger.debug(error);
      messageToTest.should.equal(error.stack.toString());
    });

  });

  describe('Logging or not logging... according to `level`', function() {

    describe('level=`trace`', function() {
      var logger = NOOT.Logger.create({
        level: 'trace',
        transport: function(message) { message.should.be.a('string'); }
      });

      it('should `trace`', function() {
        logger.trace('message');
      });
      it('should `debug`', function() {
        logger.debug('message');
      });
      it('should `info`', function() {
        logger.info('message');
      });
      it('should `warn`', function() {
        logger.warn('message');
      });
      it('should `error`', function() {
        logger.error('message');
      });
      it('should `announce`', function() {
        logger.announce('message');
      });
      it('should `highlight`', function() {
        logger.highlight('message');
      });
    });

    describe('level=`warn`', function() {
      var logger = NOOT.Logger.create({
        level: 'warn',
        transport: function(message, level) {
          if (!~['announce', 'highlight', 'warn', 'error'].indexOf(level)) {
            throw new Error('Should not have logged this message');
          } else {
            message.should.be.a('string');
          }
        }
      });

      it('should not `trace`', function() {
        logger.trace('message');
      });
      it('should not `debug`', function() {
        logger.debug('message');
      });
      it('should not `info`', function() {
        logger.info('message');
      });
      it('should `warn`', function() {
        logger.warn('message');
      });
      it('should `error`', function() {
        logger.error('message');
      });
      it('should `announce`', function() {
        logger.announce('message');
      });
      it('should `highlight`', function() {
        logger.highlight('message');
      });
    });

    describe('level=`off`', function() {
      var logger = NOOT.Logger.create({
        level: 'off',
        transport: function() {
          throw new Error('Should not have logged this message');
        }
      });

      it('should not `trace`', function() {
        logger.trace('message');
      });
      it('should not `debug`', function() {
        logger.debug('message');
      });
      it('should not `info`', function() {
        logger.info('message');
      });
      it('should not `warn`', function() {
        logger.warn('message');
      });
      it('should not `error`', function() {
        logger.error('message');
      });
      it('should not `announce`', function() {
        logger.announce('message');
      });
      it('should not `highlight`', function() {
        logger.highlight('message');
      });
    });

  });


});