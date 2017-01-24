/*
 The MIT License (MIT)

 Copyright (c) 2017 Stefano Cappa (Ks89)
 Copyright (c) 2016 vimalavinisha

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

System.config({
  transpiler: 'typescript',
  typescriptOptions: {
    emitDecoratorMetadata: true,
    target: "ES5",
    module: "commonjs"
  },
  map: {
    '@angular'                : 'node_modules/@angular',
    'rxjs'                    : 'node_modules/rxjs',
    'angular-modal-gallery'   : 'dist/bundles',
    'app'                     : 'demo/systemjs/app'
  },
  paths: {
    'node_modules/@angular/*' : 'node_modules/@angular/*/bundles'
  },
  meta: {
    '@angular/*'              : {'format': 'cjs'}
  },
  packages: {
    'app'                               : {main: 'main', defaultExtension: 'ts'},
    'rxjs'                              : {main: 'Rx'},
    'angular-modal-gallery'             : {main: 'angular-modal-gallery.umd.js'},
    '@angular/core'                     : {main: 'core.umd.min.js'},
    '@angular/common'                   : {main: 'common.umd.min.js'},
    '@angular/compiler'                 : {main: 'compiler.umd.min.js'},
    '@angular/platform-browser'         : {main: 'platform-browser.umd.min.js'},
    '@angular/platform-browser-dynamic' : {main: 'platform-browser-dynamic.umd.min.js'}
  }
});