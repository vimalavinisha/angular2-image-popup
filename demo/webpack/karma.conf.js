'use strict';

const webpackConfig = require('./config/webpack.test');
const os = require('os');

console.log(`Starting Karma with isCI=${!!isCI()}`);

function isCI() {
  return process.env.CI || process.env.APPVEYOR || process.env.TRAVIS;
}

function getBrowsers() {
  if (process.env.CI) {
    if(process.env.APPVEYOR) { // variable defined by APPVEYOR itself
      // only for AppVeyor
      return ['Chrome', 'Firefox', 'IE'];
    } else {
      return ['PhantomJS', 'Firefox'];  // Travis CI
    }
  } else {
    switch(os.platform()) {
      case 'win32': // Windows
        // TODO add 'PhantomJS' - at the moment isn't working on Windows10 (only for test in ProfileComponent, WTF!!!)
        return ['Chrome', 'Firefox', 'IE'];
        break;
      case 'darwin': // macOS
        return ['PhantomJS', 'Chrome', 'Firefox'/*, 'Safari'*/];
        break;
      default: // other (linux, freebsd, openbsd, sunos, aix)
        return ['PhantomJS', 'Chrome', 'Firefox'];
        break;
    }
  }
}

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      "./config/karma-test-runner.js"
    ],
    // files: [
    //   {
    //     pattern: './config/karma-test-runner.js',
    //     watched: false
    //   }
    // ],
    exclude: [],
    preprocessors: {
      './config/karma-test-runner.js': ['coverage', 'webpack', 'sourcemap']
    },
    webpack: webpackConfig,

    webpackMiddleware: {
      stats: {
        chunks: false
      }
      // stats: 'errors-only'
    },

    reporters: ['progress', 'mocha', 'kjhtml', 'coverage', 'remap-coverage'],


    // webpackServer: {noInfo: true},

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: getBrowsers(),

    // It's ok, but I'm forcing --single-run, at the moment, so this value will be ignored
    singleRun: !!isCI(),

    coverageReporter: {
      type: 'in-memory'
    },

    remapCoverageReporter: {
      'text-summary': null,
      'json': './coverage/coverage.json',
      'html': './coverage/html',
      'lcovonly': './coverage/lcov.info'
    },
    jasmineDiffReporter: {
      multiline: true
    },

    // For AppVeyor and TravisCI to prevent timeouts
    browserNoActivityTimeout: 60000,
    //browserDisconnectTimeout: 60000,
    //browserDisconnectTolerance: 10
  });
};
