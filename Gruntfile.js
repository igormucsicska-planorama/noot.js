module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-githooks');
  grunt.loadNpmTasks('grunt-jscs-checker');
  grunt.loadNpmTasks('grunt-mocha-cov');


  var CHECKABLES = [
    'lib/**/*.js',
    'test/**/*.js',
    'Gruntfile.js'
  ];


  grunt.initConfig({

    /**
     * Git pre-commit hook
     */
    githooks: {
      all: {
        'pre-commit': 'check'
      }
    },

    /**
     * JSHint
     */
    jshint: {
      options: {
        '-W030': true,
        newcap: true,
        noempty: true,
        indent: 2,
        unused: true,
        eqeqeq: true,
        loopfunc: true,
        node: true,
        undef: true,
        maxparams: 4,
        maxlen: 120,
        globals: {
          /* MOCHA */
          describe: false,
          it: false,
          before: false,
          beforeEach: false,
          after: false,
          afterEach: false,
          nootrequire: false
        },
        reporter: require('jshint-stylish')
      },
      target: CHECKABLES
    },

    /**
     * JS Code Sniffer
     */
    jscs: {
      src: CHECKABLES,
      options: {
        config: 'jscs.json'
      }
    },

    /**
     * Mocha
     */
    mochacov: {
      coverage: {
        options: {
          coveralls: true
        }
      },
      test: {
        options: {
          reporter: 'spec',
          require: [
            'test/common.js'
          ]
        },
        src: ['test/**/*.test.js']
      }
    }

  });

  grunt.registerTask('hook', 'githooks');
  grunt.registerTask('test', 'mochacov:test');
  grunt.registerTask('travis', 'mochacov');
  grunt.registerTask('check', ['jshint', 'jscs', 'test']);
  grunt.registerTask('default', ['hook', 'check']);
};
