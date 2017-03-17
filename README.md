[![npm version](https://badge.fury.io/js/angular-modal-gallery.svg)](https://badge.fury.io/js/angular-modal-gallery)   [![Travis Build](https://travis-ci.org/Ks89/angular-modal-gallery.svg?branch=master)](https://travis-ci.org/Ks89/angular-modal-gallery)   [![Appveyor Build](https://ci.appveyor.com/api/projects/status/ikp5qqr9aci2s0ae/branch/master?svg=true)](https://ci.appveyor.com/project/Ks89/angular-modal-gallery/branch/master)   [![Known Vulnerabilities](https://snyk.io/test/github/ks89/angular-modal-gallery/badge.svg)](https://snyk.io/test/github/ks89/angular-modal-gallery)   [![david-dm Dependencies](https://david-dm.org/Ks89/angular-modal-gallery.svg)](https://david-dm.org/Ks89/angular-modal-gallery)   [![Code Climate](https://codeclimate.com/github/Ks89/angular-modal-gallery/badges/gpa.svg)](https://codeclimate.com/github/Ks89/angular-modal-gallery)   [![Code Climate Coverage](https://codeclimate.com/github/Ks89/angular-modal-gallery/badges/coverage.svg)](https://codeclimate.com/github/Ks89/angular-modal-gallery/coverage)   [![Coveralls Coverage](https://coveralls.io/repos/github/Ks89/angular-modal-gallery/badge.svg?branch=master)](https://coveralls.io/github/Ks89/angular-modal-gallery?branch=master)

[![bitHound Overall Score](https://www.bithound.io/github/Ks89/angular-modal-gallery/badges/score.svg)](https://www.bithound.io/github/Ks89/angular-modal-gallery)   [![bitHound Code](https://www.bithound.io/github/Ks89/angular-modal-gallery/badges/code.svg)](https://www.bithound.io/github/Ks89/angular-modal-gallery)   [![bitHound Dependencies](https://www.bithound.io/github/Ks89/angular-modal-gallery/badges/dependencies.svg)](https://www.bithound.io/github/Ks89/angular-modal-gallery/master/dependencies/npm)   [![bitHound Dev Dependencies](https://www.bithound.io/github/Ks89/angular-modal-gallery/badges/devDependencies.svg)](https://www.bithound.io/github/Ks89/angular-modal-gallery/master/dependencies/npm)

[![NPM](https://nodei.co/npm/angular-modal-gallery.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/angular-modal-gallery/)    [![NPM](https://nodei.co/npm-dl/angular-modal-gallery.png?months=9&height=3)](https://nodei.co/npm/angular-modal-gallery/)

<br>

# Angular modal gallery

An Angular library to create an image gallery of clickable thumbnails. After a click, it will display a modal window with full screen images.
It's also possible to navigate between these images with both keyboard arrows, swipe gestures and mouse clicks and close it pressing `esc`.
Starting from version 3, you can download images (with the button or with the keyboard shortcut ctrl+s / cmd+s) or navigate to an external url.

This project was born as a fork of [THIS REPO](https://github.com/vimalavinisha/angular2-image-popup).

**This library uses [Semantic versioning 2.0.0](http://semver.org/) also known as 'semver'**


## **Official live DEMO + DOCUMENTATION**

*Image loading could be slow, because this demo is hosted on Github pages*

[CLICK HERE FOR DEMO/DOCUMENTATION](https://ks89.github.io/angular-modal-gallery.github.io/)


## Installation
- `npm install --save font-awesome`
- `npm install --save hammerjs mousetrap`
- `npm install --save-dev @types/hammerjs @types/mousetrap`
- `npm install --save angular-modal-gallery`
- `npm install --save hammerjs @types/hammerjs` (not requested in version 2.x.x, but it will be mandatory with 3.x.x)


## News

**Version 3.0.0 - work in progress** with some breaking changes [PREVIEW HERE](https://github.com/Ks89/angular-modal-gallery/tree/develop).<br>
*I'll write a tutorial to migrate from 2.x.x to 3.x.x*

- 03/??/2017 - 3.0.0 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 01/30/2017 - 2.0.2 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 01/29/2017 - 2.0.1 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 01/29/2017 - 2.0.0 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 01/28/2017 - 2.0.0-alpha.1 - angular-modal-gallery


## Features
- Angular module to import this library
- Angular component to display the image gallery
- AOT support
- Angular >=2 (it's also working with Angular 4, as you can see in `demo/webpack`)
- Tested with Webpack 2 + Treeshaking and also inside a Lazy loaded module (check `demo/webpack`)
- and so on...


## How to use it?

Two different ways:
- using my full and runnable examples (`SystemJs`, `Webpack2`, `angular-cli`) [HERE](https://github.com/Ks89/angular-modal-gallery/tree/master/demo)
- checking small and minimal demos into official documentation [HERE](https://ks89.github.io/angular-modal-gallery.github.io/demo)


## Contributing

Check `CONTRIBUTING.md` in this repository


## Developer informations

Check `DEVELOPER.md` in this repository


## License

The MIT License (MIT)

Copyright (c) 2017 Stefano Cappa (Ks89)<br>
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
