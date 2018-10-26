'use strict';

module.exports = function(karma) {
  karma.set({

    frameworks: [ 'browserify', 'mocha' ],

    files: [
      'test/**/*spec.js'
    ],

    preprocessors: {
      'test/**/*spec.js': [ 'browserify' ]
    },

    logLevel: 'DEBUG',
    //
    // singleRun: true,
    // autoWatch: false,

    // browserify configuration
    browserify: {
      debug: true,
      plugin: ['stringify']
    }
  });
};
