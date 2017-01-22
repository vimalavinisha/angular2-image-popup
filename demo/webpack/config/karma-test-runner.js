Error.stackTraceLimit = Infinity;

require('core-js/es6');
require('reflect-metadata');

// Typescript emit helpers polyfill
require('ts-helpers');
require('./matchers');

require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/proxy');
require('zone.js/dist/sync-test');
require('zone.js/dist/jasmine-patch');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');

// RxJS
require('rxjs/Rx');



//https://github.com/qdouble/angular-webpack2-starter/blob/master/test-config/spec-bundle.js

/*
 * Ok, this is kinda crazy. We can use the the context method on
 * require that webpack created in order to tell webpack
 * what files we actually want to require or import.
 * Below, context will be an function/object with file names as keys.
 * using that regex we are saying look in ./src/app and ./test then find
 * any file that ends with spec.js and get its path. By passing in true
 * we say do this recursively
 */
var testContext = require.context('../src', true, /\.spec\.ts/);


/*
 * get all the files, for each file, call the context function
 * that will require the file and load it up here. Context will
 * loop and require those spec files here
 */
function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

// requires and returns all modules that match
const modules = requireAll(testContext);


const testing = require('@angular/core/testing');
const browser = require('@angular/platform-browser-dynamic/testing');

testing.getTestBed().initTestEnvironment(
  browser.BrowserDynamicTestingModule,
  browser.platformBrowserDynamicTesting()
);