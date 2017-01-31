/*
 The MIT License (MIT)

 Copyright (c) 2017 Stefano Cappa (Ks89)

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

import postcss from 'rollup-plugin-postcss';

export default {
  entry     : 'dist/index.js',
  dest      : 'dist/bundles/angular-modal-gallery.umd.js',
  format    : 'umd',
  sourceMap: false,
  globals   : {
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common'
  },
  // external: [
  //   '@angular/core',
  //   '@angular/common',
  //   '@angular/compiler',
  //   '@angular/platform-browser',
  //   '@angular/platform-browser-dynamic',
  //   '@angular/router'
  // ],
  moduleName: 'ng.angular.modal.gallery',
  plugins: [
    postcss({
      extensions: [ '.css' ],
    })
  ]
}
