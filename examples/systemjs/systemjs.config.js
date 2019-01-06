/*
 The MIT License (MIT)

 Copyright (c) 2017-2019 Stefano Cappa (Ks89)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the 'Software'), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
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

    '@angular/cdk': 'node_modules/@angular/cdk/bundles/cdk.umd.js',
    '@angular/cdk/a11y': 'node_modules/@angular/cdk/bundles/cdk-a11y.umd.js',
    '@angular/cdk/accordion': 'node_modules/@angular/cdk/bundles/cdk-accordion.umd.js',
    '@angular/cdk/bidi': 'node_modules/@angular/cdk/bundles/cdk-bidi.umd.js',
    '@angular/cdk/coercion': 'node_modules/@angular/cdk/bundles/cdk-coercion.umd.js',
    '@angular/cdk/collections': 'node_modules/@angular/cdk/bundles/cdk-collections.umd.js',
    '@angular/cdk/drag-drop': 'node_modules/@angular/cdk/bundles/cdk-drag-drop.umd.js',
    '@angular/cdk/keycodes': 'node_modules/@angular/cdk/bundles/cdk-keycodes.umd.js',
    '@angular/cdk/layout': 'node_modules/@angular/cdk/bundles/cdk-layout.umd.js',
    '@angular/cdk/observers': 'node_modules/@angular/cdk/bundles/cdk-observers.umd.js',
    '@angular/cdk/overlay': 'node_modules/@angular/cdk/bundles/cdk-overlay.umd.js',
    '@angular/cdk/platform': 'node_modules/@angular/cdk/bundles/cdk-platform.umd.js',
    '@angular/cdk/portal': 'node_modules/@angular/cdk/bundles/cdk-portal.umd.js',
    '@angular/cdk/scrolling': 'node_modules/@angular/cdk/bundles/cdk-scrolling.umd.js',
    '@angular/cdk/stepper': 'node_modules/@angular/cdk/bundles/cdk-stepper.umd.js',
    '@angular/cdk/table': 'node_modules/@angular/cdk/bundles/cdk-table.umd.js',
    '@angular/cdk/text-field': 'node_modules/@angular/cdk/bundles/cdk-text-field.umd.js',
    '@angular/cdk/tree': 'node_modules/@angular/cdk/bundles/cdk-tree.umd.js',

    rxjs: 'node_modules/rxjs',
    'rxjs/internal-compatibility': 'node_modules/rxjs/internal-compatibility',
    'rxjs/testing': 'node_modules/rxjs/testing',
    'rxjs/ajax': 'node_modules/rxjs/ajax',
    'rxjs/operators': 'node_modules/rxjs/operators',
    'rxjs/webSocket': 'node_modules/rxjs/webSocket',
    hammerjs: 'node_modules/hammerjs',
    mousetrap: 'node_modules/mousetrap',
    '@ks89': 'node_modules/@ks89',
    '@fortawesome': 'node_modules/@fortawesome'
  };
  // packages tells the System loader how to load when no filename and/or no extension
  let packages = {
    app: {
      main: 'main',
      // The only modules that will contain template or styles URLs are the
      // component directives. And, by convention, these files will all end
      // with the suffix, ".component.js". The rest of the modules can be
      // loaded without any in-browser translation.
      meta: {
        '*.component.js': {
          loader: 'system.component-loader.js'
        }
      }
    },
    'rxjs/internal-compatibility': { main: 'index.js', defaultExtension: 'js' },
    'rxjs/ajax': { main: 'index.js', defaultExtension: 'js' },
    'rxjs/operators': { main: 'index.js', defaultExtension: 'js' },
    'rxjs/testing': { main: 'index.js', defaultExtension: 'js' },
    'rxjs/webSocket': { main: 'index.js', defaultExtension: 'js' },
    rxjs: { main: 'index.js', defaultExtension: 'js' },
    hammerjs: { main: 'hammer.js' },
    mousetrap: { main: 'mousetrap.js' },
    '@fortawesome/fontawesome-svg-core': { main: 'index.js', defaultExtension: 'js' },
    '@fortawesome/free-solid-svg-icons': { main: 'index.js', defaultExtension: 'js' },
    '@ks89/angular-modal-gallery': { main: 'bundles/ks89-angular-modal-gallery.umd.min.js', defaultExtension: 'js' }
  };

  let ngPackageNames = ['common', 'compiler', 'core', 'forms', 'http', 'platform-browser', 'platform-browser-dynamic', 'router'];

  // Individual files (~300 requests):
  function packIndex(pkgName) {
    packages['@angular/' + pkgName] = { main: 'index.js', defaultExtension: 'js' };
  }

  // Bundled (~40 requests):
  function packUmd(pkgName) {
    packages['@angular/' + pkgName] = { main: 'bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
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
