module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-githooks');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-mocha-cov');
  grunt.loadNpmTasks('grunt-blanket');

  var args = require('minimist')(process.argv, {
    strings: ['file']
  });

  var TO_IGNORE = [
    '**/*.js',
    '!**/node_modules/**'
  ];


  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

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
        jshintrc: true,
        reporter: require('jshint-stylish')
      },
      all: TO_IGNORE
    },

    /**
     * JS Code Sniffer
     */
    jscs: {
      all: TO_IGNORE,
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
        src: args.file ? args.file : ['test/**/*.test.js']
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
