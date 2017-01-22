// 'use strict';

require('ts-node/register');

const helpers = require('./helpers');

// to run this file with `protractor`:
// 1. `npm run build`
// 2. start server-side to serve client-side (this project)
// 3. now you can run `protractor` on port 3001

exports.config = {
  baseUrl: 'http://localhost:3000',

  specs: [
    helpers.root('e2e/**/*.e2e.ts'),
    helpers.root('e2e/**/**.e2e.ts'),
  ],
  exclude: [],

  framework: 'jasmine2',

  allScriptsTimeout: 110000,

  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: false,
    includeStackTrace: false,
    defaultTimeoutInterval: 400000
  },
  directConnect: true,

  multiCapabilities: [
    // {
    //   browserName: 'firefox'
    // },
    {
      browserName: 'chrome',
      chromeOptions: {
        args: ['show-fps-counter=true']
      }
    }
  ],

  onPrepare: function() {
    browser.ignoreSynchronization = true;
  },

  /**
   * Angular 2 configuration
   *
   * useAllAngular2AppRoots: tells Protractor to wait for any angular2 apps on the page instead of just the one matching
   * `rootEl`
   */
  useAllAngular2AppRoots: true
};
