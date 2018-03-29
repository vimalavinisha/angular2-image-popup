/*
 The MIT License (MIT)

 Copyright (c) 2017-2018 Stefano Cappa (Ks89)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

(function(global) {
  // map tells the System loader where to look for things
  let map = {
    app: 'app',
    '@angular': 'node_modules/@angular',
    rxjs: 'node_modules/rxjs',
    hammerjs: 'node_modules/hammerjs',
    mousetrap: 'node_modules/mousetrap',
    '@ks89': 'node_modules/@ks89',
    '@fortawesome': 'node_modules/@fortawesome'
  };
  // packages tells the System loader how to load when no filename and/or no extension
  let packages = {
    app: { main: 'main' },
    rxjs: { main: 'Rx' },
    hammerjs: { main: 'hammer.js' },
    mousetrap: { main: 'mousetrap.js' },
    '@fortawesome/fontawesome': { main: 'index.js', defaultExtension: 'js' },
    '@fortawesome/fontawesome-free-solid': { main: 'index.js', defaultExtension: 'js' },
    '@ks89/angular-modal-gallery': { main: 'bundles/angular-modal-gallery.umd.min.js', defaultExtension: 'js' }
  };
  let ngPackageNames = ['common', 'compiler', 'core', 'forms', 'platform-browser', 'platform-browser-dynamic'];

  // Individual files (~300 requests):
  function packIndex(pkgName) {
    packages['@angular/' + pkgName] = { main: 'index.js', defaultExtension: 'js' };
  }

  // Bundled (~40 requests):
  function packUmd(pkgName) {
    packages['@angular/' + pkgName] = { main: '/bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
  }

  // Most environments should use UMD; some (Karma) need the individual index files
  let setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
  // Add package entries for angular packages
  ngPackageNames.forEach(setPackageConfig);

  let config = {
    transpiler: 'ts',
    map: map,
    packages: packages
  };
  System.config(config);
})(this);
