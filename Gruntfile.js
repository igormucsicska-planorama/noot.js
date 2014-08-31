module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-githooks');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-mocha-cov');
  grunt.loadNpmTasks('grunt-blanket');


  var CHECKABLES = [
    'src/**/*.js',
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
        config: '.jscsrc'
      }
    },

    /**
     * Mocha
     */
    mochacov: {
      test: {
        options: {
          reporter: 'spec',
          recursive: true,
          require: [
            'test/common.js'
          ]
        },
        src: ['test/**/*.test.js']
      },
      coveralls: {
        options: {
          coveralls: true,
          serviceName: 'travis-ci',
          repoToken: 'zt4SqTZh4UIbo6cFWlXkMTvPA0DNqlFcr',
          recursive: true,
          require: [
            'test/common.js'
          ]
        },
        src: ['test/**/*.test.js']
      },
      coverage: {
        options: {
          reporter: 'html-cov',
          output: 'coverage.html',
          quiet: true,
          recursive: true,
          require: [
            'test/common.js'
          ],
          src: ['test/**/*.test.js']
        }
      }
    }
  });

  grunt.registerTask('hook', 'githooks');
  grunt.registerTask('test', 'mochacov:test');
  grunt.registerTask('cov', ['mochacov:test', 'mochacov:coverage']);
  grunt.registerTask('check', ['hook', 'jshint', 'jscs', 'mochacov:test']);
  grunt.registerTask('travis', ['check', 'mochacov:coveralls']);
  grunt.registerTask('default', 'check');
};
