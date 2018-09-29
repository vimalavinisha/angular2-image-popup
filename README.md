![npm@latest](https://badge.fury.io/js/%40ks89%2Fangular-modal-gallery.svg)

[New package](https://www.npmjs.com/package/@ks89/angular-modal-gallery) >=6: [![npm](https://img.shields.io/npm/dw/@ks89/angular-modal-gallery.svg)](https://www.npmjs.com/package/@ks89/angular-modal-gallery)   [![npm](https://img.shields.io/npm/dm/@ks89/angular-modal-gallery.svg)](https://www.npmjs.com/package/@ks89/angular-modal-gallery)   [![npm](https://img.shields.io/npm/dy/@ks89/angular-modal-gallery.svg)](https://www.npmjs.com/package/@ks89/angular-modal-gallery)

[Old package](https://www.npmjs.com/package/angular-modal-gallery) <=5: [![npm](https://img.shields.io/npm/dw/angular-modal-gallery.svg)](https://www.npmjs.com/package/angular-modal-gallery)   [![npm](https://img.shields.io/npm/dm/angular-modal-gallery.svg)](https://www.npmjs.com/package/angular-modal-gallery)   [![npm](https://img.shields.io/npm/dy/angular-modal-gallery.svg)](https://www.npmjs.com/package/angular-modal-gallery)

[![Travis Build](https://travis-ci.org/Ks89/angular-modal-gallery.svg?branch=master)](https://travis-ci.org/Ks89/angular-modal-gallery)   [![Appveyor Build](https://ci.appveyor.com/api/projects/status/ikp5qqr9aci2s0ae/branch/master?svg=true)](https://ci.appveyor.com/project/Ks89/angular-modal-gallery/branch/master)   [![CircleCI Build](https://circleci.com/gh/Ks89/angular-modal-gallery.svg?style=svg)](https://circleci.com/gh/Ks89/angular-modal-gallery)   [![Known Vulnerabilities](https://snyk.io/test/github/ks89/angular-modal-gallery/badge.svg)](https://snyk.io/test/github/ks89/angular-modal-gallery)   [![david-dm Dependencies](https://david-dm.org/Ks89/angular-modal-gallery.svg)](https://david-dm.org/Ks89/angular-modal-gallery)   [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FKs89%2Fangular-modal-gallery.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FKs89%2Fangular-modal-gallery?ref=badge_shield)   [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)   [![Code Climate](https://codeclimate.com/github/Ks89/angular-modal-gallery/badges/gpa.svg)](https://codeclimate.com/github/Ks89/angular-modal-gallery)   [![Code Climate Coverage](https://codeclimate.com/github/Ks89/angular-modal-gallery/badges/coverage.svg)](https://codeclimate.com/github/Ks89/angular-modal-gallery/coverage)   [![Coveralls Coverage](https://coveralls.io/repos/github/Ks89/angular-modal-gallery/badge.svg?branch=master)](https://coveralls.io/github/Ks89/angular-modal-gallery?branch=master)

[![GitHub release](https://img.shields.io/github/release/Ks89/angular-modal-gallery.svg?style=flat-square)](https://github.com/Ks89/angular-modal-gallery)   [![GitHub (pre-)release](https://img.shields.io/github/release/Ks89/angular-modal-gallery/all.svg?style=flat-square)](https://github.com/Ks89/angular-modal-gallery)

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/stefanocappa)

*Do you like @ks89/angular-modal-gallery? Please, add a 'star' to support this library*

<br>
<br>

:rocket: **@ks89/angular-modal-gallery 7.0.0 WORK IN PROGRESS** :rocket:
It will be released this autumn with some great improvements like carousel and new features. Also I want to support Angular 7 Ivy Renderer (aka Renderer3)
For more info, watch this issue: [7.0.0 major release](https://github.com/Ks89/angular-modal-gallery/issues/144)

<br><br><br>

# @ks89/angular-modal-gallery

<br>

![angular-modal-gallery image](https://github.com/Ks89/angular-modal-gallery/blob/master/amg.png?raw=true)

<br>

**@ks89/angular-modal-gallery** is an Angular library (**SSR compatible**) to create image galleries.
<br>
Despite its name, this library is more than for modal galleries, because I'm introducing new features every major release.
In fact, It's composed by 3 main parts

- **plain-gallery**: shows either a row, a column or a grid of **clickable thumbnails** using pure flexbox
- **modal-gallery**: is the core part of this project and display a **modal window with full screen images**, **buttons**, the **current image** and optionally, also navigation **dots** and **previews**
- **carousel**: is the new feature introduced in 7.0.0 to show a configurable plain carousel (not modal) with auto-play and other cool features

**@ks89/angular-modal-gallery** supports also **keyboard shortcuts**, **swipe gestures** and **mouse events**.

<br>

**This library uses [Semantic versioning 2.0.0](http://semver.org/) also known as 'semver'**

**@ks89/angular-modal-gallery requires Internet Explorer >= 11 and Angular >= 6.x.x**


## :boom: Features :boom:
- Angular Module to import this library
- works with IE >= 11
- works with both JIT and AOT compilers
- supports all **recommended Angular Compiler Options**
- Angular >= 6
- compliant to Angular Package Format v6 specifications
- official examples with `angular-cli`, `angular-cli + material`, `SystemJS` and `angular-universal` [HERE](https://github.com/Ks89/angular-modal-gallery/tree/master/examples)
- unit testing with high % coverage
- **Server Side Rendering** support with angular-universal
- Web Accessibility features, like ARIA support and [toptal.com](https://www.toptal.com/designers/colorfilter) criteria (tested with `Sim Daltonism` for macOS)
- image **download** with buttons or keyboard shortcuts
- advanced **keyboard shortcuts** with `mousetrap` (both local and global)
- fully configurable default buttons to either close, download, navigate to an external url or delete images and so on
- support custom buttons with both pre and after hooks
- **click outside feature** to close the modal gallery clicking on the background
- configurable plain gallery
- configurable carousel
- configurable side-previews (visible only on bigger screen)
- configurable dots navigation (visible only on bigger screen)
- configurable previews (visible only on bigger screen)
- and so on... (check the official documentation [HERE](https://ks89.github.io/angular-modal-gallery-2018-v7.github.io/))


## :book: **Documentation** :book:

*Image loading could be slow, because this website is hosted on Github pages*

[OFFICIAL DOCUMENTATION WEBSITE](https://ks89.github.io/angular-modal-gallery-2018-v7.github.io/)


## :microphone: **Live demo** :microphone:

[OFFICIAL LIVE DEMO](https://stackblitz.com/edit/angular-modal-gallery-v7/)


## :package: Installation :package:
- `npm install --save @ks89/angular-modal-gallery`
- `npm install --save hammerjs mousetrap`
- `npm install --save-dev @types/mousetrap @types/hammerjs`

From version @ks89/angular-modal-gallery >= 5.0.0, **font-awesome isn't a mandatory dependency**.
You can use all default features without font-awesome. For more info, check official [documentation website](https://ks89.github.io/angular-modal-gallery-2018-v7.github.io/).


## :warning: Which version should I use? :warning:

|            | @ks89/angular-modal-gallery | font-awesome |
| ---------- | :---:                       | :---:        |
| AngularJS  | NOT SUPPORTED               |              |
| Angular 2  | &lt;= 3.3.5                 | &gt;= 4.0.0  |
| Angular 4  | &lt;= 5.5.0                 | optional     |
| Angular 5  | &gt;= 5.0.0                 | optional     |
| Angular 6  | &gt;= 5.4.0                 | optional     |
| Angular 7  | &gt;= 7.0.0                 | optional     |


## :fire: News :fire:

**More than 80 releases in two years**, and more to come... :)

- 09/29/2018 - 7.0.0-alpha.1 - @ks89/angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 09/15/2018 - 6.2.3 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- ... (many minor 6.x.x versions)
- 06/10/2018 - 6.0.0 - @ks89/angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- ... (many minor 5.x.x versions)
- 02/27/2018 - 5.0.0 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- ... (many minor 4.x.x versions)
- 11/05/2017 - 4.0.0 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- ... (many minor 3.x.x versions)
- 03/20/2017 - 3.0.0 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- ... (many minor 2.x.x versions)
- 01/29/2017 - 2.0.0 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)


## :question: FAQS :question:

1. Question: **I have this error: `Cannot find name 'MousetrapInstance'`. What can I do?**<br>
   **Answer**: Simply run `npm i --save-dev @types/mousetrap`
2. Question: **I have this error: `Error: No provider for KeyboardService`. What can I do?**<br>
   **Answer**: You forgot to add .forRoot(), so KeyboardService will be never available as a service. Please read section "Installation" [HERE](https://ks89.github.io/angular-modal-gallery-2018-v7.github.io/gettingStarted).
   This is a common design pattern for Angular libraries. For more info check also [this issue](https://github.com/Ks89/angular-modal-gallery/issues/94).
3. Question: **How can I remove images using DELETE button without issues?**<br>
   **Answer**: **You cannot change the input image array. Instead, you should reassign it with a newer array** without the deleted element.
   In other words, **you must think in a functional way**, without changing the input array of images.
   For more information check this official demo [HERE](https://ks89.github.io/angular-modal-gallery-2018-v7.github.io/demo/buttons-strategies).


## :computer: Contributing :computer:

Check `CONTRIBUTING.md` in this repository

Also, if you want to generate the `internal library documentation`, run `npm run docs` and open `./docs/typedoc/index.html`.


## :sparkling_heart: A big thank you to :sparkling_heart:

##### all authors of icons used in this library:
- Icons made by <a href="https://www.flaticon.com/authors/smartline" title="Smartline">Smartline</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
- Icons made by <a href="https://www.flaticon.com/authors/dave-gandy" title="Dave Gandy">Dave Gandy</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
- Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
- Icons made by <a href="https://www.flaticon.com/authors/those-icons" title="Those Icons">Those Icons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
- Icons made by <a href="https://www.flaticon.com/authors/gregor-cresnar" title="Gregor Cresnar">Gregor Cresnar</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
- Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
- Icons made by <a href="https://www.flaticon.com/authors/dario-ferrando" title="Dario Ferrando">Dario Ferrando</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>

##### all authors of spinners used in this library:
- <a href="https://github.com/lukehaas">Luke Haas (@lukehaas)</a> - <a href="https://github.com/lukehaas/css-loaders">lukehaas/css-loaders</a></li>
- <a href="https://github.com/martinvd">Martin van Driel (@martinvd)</a> - <a href="https://codepen.io/martinvd/pen/xbQJom">martinvd example on codepen.io</a></li>
- <a href="https://devalchemist.com/">Devilish Alchemist</a> - <a href="https://codepen.io/devilishalchemist/pen/emOVYQ">devilishalchemist example on codepen.io</a></li>
- <a href="https://github.com/nikhil8krishnan">Nikhil Krishnan</a> - <a href="https://codepen.io/nikhil8krishnan/pen/dMEzGx">nikhil8krishnan example on codepen.io</a></li>
- <a href="https://codepen.io/WebSonata/">Anastasiya Kuligina</a> - <a href="https://codepen.io/WebSonata/pen/bRaONB">Anastasiya Kuligina example on codepen.io</a></li>

## :copyright: License :copyright:

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
FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

<br/>

If you like my projects you can do a free donation here [![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/stefanocappa)


## FOSSA report

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FKs89%2Fangular-modal-gallery.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FKs89%2Fangular-modal-gallery?ref=badge_large)

<br/>

**Created by Stefano Cappa**
