[![npm@latest](https://img.shields.io/npm/v/angular-modal-gallery.svg?style=flat-square)](https://www.npmjs.com/package/angular-modal-gallery)   [![npm@beta](https://img.shields.io/npm/v/angular-modal-gallery/beta.svg?style=flat-square)](https://www.npmjs.com/package/angular-modal-gallery)   [![npm@next](https://img.shields.io/npm/v/angular-modal-gallery/next.svg?style=flat-square)](https://www.npmjs.com/package/angular-modal-gallery)

[![npm](https://img.shields.io/npm/dw/angular-modal-gallery.svg)](https://www.npmjs.com/package/angular-modal-gallery)   [![npm](https://img.shields.io/npm/dm/angular-modal-gallery.svg)](https://www.npmjs.com/package/angular-modal-gallery)   [![npm](https://img.shields.io/npm/dy/angular-modal-gallery.svg)](https://www.npmjs.com/package/angular-modal-gallery)

[![Travis Build](https://travis-ci.org/Ks89/angular-modal-gallery.svg?branch=master)](https://travis-ci.org/Ks89/angular-modal-gallery)   [![Appveyor Build](https://ci.appveyor.com/api/projects/status/ikp5qqr9aci2s0ae/branch/master?svg=true)](https://ci.appveyor.com/project/Ks89/angular-modal-gallery/branch/master)   [![CircleCI Build](https://circleci.com/gh/Ks89/angular-modal-gallery.svg?style=svg)](https://circleci.com/gh/Ks89/angular-modal-gallery)   [![Known Vulnerabilities](https://snyk.io/test/github/ks89/angular-modal-gallery/badge.svg)](https://snyk.io/test/github/ks89/angular-modal-gallery)   [![david-dm Dependencies](https://david-dm.org/Ks89/angular-modal-gallery.svg)](https://david-dm.org/Ks89/angular-modal-gallery)   [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FKs89%2Fangular-modal-gallery.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FKs89%2Fangular-modal-gallery?ref=badge_shield)   [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)   [![Code Climate](https://codeclimate.com/github/Ks89/angular-modal-gallery/badges/gpa.svg)](https://codeclimate.com/github/Ks89/angular-modal-gallery)   [![Code Climate Coverage](https://codeclimate.com/github/Ks89/angular-modal-gallery/badges/coverage.svg)](https://codeclimate.com/github/Ks89/angular-modal-gallery/coverage)   [![Coveralls Coverage](https://coveralls.io/repos/github/Ks89/angular-modal-gallery/badge.svg?branch=master)](https://coveralls.io/github/Ks89/angular-modal-gallery?branch=master)

[![GitHub release](https://img.shields.io/github/release/Ks89/angular-modal-gallery.svg?style=flat-square)](https://github.com/Ks89/angular-modal-gallery)   [![GitHub (pre-)release](https://img.shields.io/github/release/Ks89/angular-modal-gallery/all.svg?style=flat-square)](https://github.com/Ks89/angular-modal-gallery)

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/stefanocappa)

*Do you like angular-modal-gallery? Please, add a 'star' to support this library*

<br>

# angular-modal-gallery

<br>

![angular-modal-gallery image](https://github.com/Ks89/angular-modal-gallery/blob/develop/amg5.png?raw=true)

<br>

**angular-modal-gallery** is an Angular library (SSR compatible) to create image galleries of **clickable thumbnails**.
After a click, it will display a **modal window with full screen images**.
Modal view is composed by **buttons**, the **current image** and optionally, also navigation **dots** and **previews**.
<br>
It's also possible to navigate between these modal images with both **keyboard arrows**, **swipe gestures** and **mouse** clicks and close it pressing **`esc`**.

<br>

## Major release 6.0.0 in coming on May 2018!!!
**New package name `@ks89/angular-modal-gallery`** as suggested by npmjs with scoping, so starting from version 6, you'll have to uninstall 'angular-modal-gallery' and install this new package.
There will be **some breaking changes** (obviously), but don't be scared, It won't be like version 5.0.0.
I want to fix some APIs, cleanup the code, remove Angular 4 compatibility and and some new features.

<br>
<br>

**This library uses [Semantic versioning 2.0.0](http://semver.org/) also known as 'semver'**

**angular-modal-gallery requires Internet Explorer >= 11 and Angular >= 4**


## Features
- Angular module to import this library
- works with IE >= 11
- AOT support
- Angular >= 4 (Angular >=5 supported from version 4.0.0 and Angular >=6 from version 5.4.0)
- compliant to [Angular Package Format v4.0]( https://goo.gl/AMOU5G) specifications
- official examples with `angular-cli`, `angular-cli + material`, `SystemJS` and `Webpack` [HERE](https://github.com/Ks89/angular-modal-gallery/tree/master/examples)
- unit testing with high % coverage
- **Server Side Rendering** support with angular-universal (from version 5.2.0)
- Web Accessibility features, like ARIA support and [toptal.com](https://www.toptal.com/designers/colorfilter) criteria (tested with `Sim Daltonism` for macOS)
- image **download** with buttons or keyboard shortcuts
- advanced **keyboard shortcuts** with `mousetrap` (both local and global)
- fully configurable default buttons to either close, download, navigate to an external url or delete images
- support custom buttons with both pre and after hooks
- **click outside feature** to close the modal gallery clicking on the background
- configurable plain gallery
- configurable side-previews (visible only on bigger screen)
- configurable dots navigation (visible only on bigger screen)
- configurable previews (visible only on bigger screen)
- and so on... (check the official documentation [HERE](https://ks89.github.io/angular-modal-gallery-2018.github.io/))


## **Documentation**

*Image loading could be slow, because this website is hosted on Github pages*

[OFFICIAL DOCUMENTATION WEBSITE](https://ks89.github.io/angular-modal-gallery-2018.github.io/)


## **Live demo**

[OFFICIAL LIVE DEMO](https://stackblitz.com/edit/angular-modal-gallery-v5/)


## Installation
- `npm install --save angular-modal-gallery`
- `npm install --save hammerjs mousetrap`
- `npm install --save-dev @types/mousetrap @types/hammerjs`

From version 5.0.0, **font-awesome isn't a mandatory dependency**. You can use all default features without font-awesome. For more info, check official [documentation website](https://ks89.github.io/angular-modal-gallery-2018.github.io/).


## Which version should I use?

|            | angular-modal-gallery | font-awesome |
| ---------- | :---:                 | :---:        |
| AngularJS  | NOT SUPPORTED         |              |
| Angular 2  | &lt;= 3.3.5           | &gt;= 4.0.0  |
| Angular 4  | &gt;= 5.0.0           | optional     | 
| Angular 5  | &gt;= 5.0.0           | optional     |
| Angular 6  | &gt;= 5.4.0           | optional     |


## News
- 06/05/2018 - 5.7.1 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 05/05/2018 - 5.7.0 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 01/05/2018 - 5.6.0 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 04/27/2018 - 5.6.0-beta.1 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 04/27/2018 - 5.5.1 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 04/07/2018 - 5.5.0 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 04/03/2018 - 5.4.0 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 04/03/2018 - 5.4.0-beta.3 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 03/28/2018 - 5.4.0-beta.2 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 03/28/2018 - 5.4.0-beta.1 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 03/24/2018 - 5.3.0 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 03/18/2018 - 5.3.0-beta.1 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 03/18/2018 - 5.2.2 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 03/15/2018 - 5.2.1 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 03/08/2018 - 5.2.0 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 03/05/2018 - 5.2.0-beta.1 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 03/04/2018 - 5.1.0 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 03/04/2018 - 5.1.0-beta.2 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 03/01/2018 - 5.1.0-beta.1 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 02/27/2018 - 5.0.1 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 02/27/2018 - 5.0.0 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 02/24/2018 - 5.0.0-rc.3 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 02/24/2018 - 5.0.0-rc.2 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 02/17/2018 - 5.0.0-rc.1 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 02/10/2018 - 5.0.0-beta.2 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 01/24/2018 - 5.0.0-beta.1 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 01/14/2018 - 5.0.0-alpha.5 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 12/24/2017 - 5.0.0-alpha.4 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 12/09/2017 - 5.0.0-alpha.3 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 12/03/2017 - 5.0.0-alpha.2 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 12/03/2017 - 5.0.0-alpha.1 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 11/05/2017 - 4.0.1 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 11/05/2017 - 4.0.0 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 10/11/2017 - 3.3.5 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- ...
- 03/20/2017 - 3.0.0 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- ...
- 01/29/2017 - 2.0.0 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)


## FAQS

1. Question: **I have this error: `Cannot find name 'MousetrapInstance'`. What can I do?**<br>
   **Answer**: Simply run `npm i --save-dev @types/mousetrap`
2. Question: **I have this error: `Error: No provider for KeyboardService`. What can I do?**<br>
   **Answer**: You forgot to add .forRoot(), so KeyboardService will be never available as a service. Please read section "Installation" [HERE](https://ks89.github.io/angular-modal-gallery-2018.github.io/gettingStarted).
   This is a common design pattern for Angular libraries. For more info check also [this issue](https://github.com/Ks89/angular-modal-gallery/issues/94).
3. Question: **How can I remove images using DELETE button without issues?**<br>
   **Answer**: **You cannot change the input image array. Instead, you should reassign it with a newer array** without the deleted element.
   In other words, **you must think in a functional way**, without changing the input array of images.
   For more information check this official demo [HERE](https://ks89.github.io/angular-modal-gallery-2018.github.io/demo/buttons-strategies).


## Contributing

Check `CONTRIBUTING.md` in this repository

Also, if you want to generate the `internal library documentation`, run `npm run docs` and open `./docs/typedoc/index.html`.


## A big thank you to

##### all authors of icons used in this library:
- Icons made by <a href="https://www.flaticon.com/authors/smartline" title="Smartline">Smartline</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
- Icons made by <a href="https://www.flaticon.com/authors/dave-gandy" title="Dave Gandy">Dave Gandy</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
- Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
- Icons made by <a href="https://www.flaticon.com/authors/those-icons" title="Those Icons">Those Icons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
- Icons made by <a href="https://www.flaticon.com/authors/gregor-cresnar" title="Gregor Cresnar">Gregor Cresnar</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
  
##### all authors of spinners used in this library:
- <a href="https://github.com/lukehaas">Luke Haas (@lukehaas)</a> - <a href="https://github.com/lukehaas/css-loaders">lukehaas/css-loaders</a></li>
- <a href="https://github.com/martinvd">Martin van Driel (@martinvd)</a> - <a href="https://codepen.io/martinvd/pen/xbQJom">martinvd example on codepen.io</a></li>
- <a href="https://devalchemist.com/">Devilish Alchemist</a> - <a href="https://codepen.io/devilishalchemist/pen/emOVYQ">devilishalchemist example on codepen.io</a></li>
- <a href="https://github.com/nikhil8krishnan">Nikhil Krishnan</a> - <a href="https://codepen.io/nikhil8krishnan/pen/dMEzGx">nikhil8krishnan example on codepen.io</a></li>
- <a href="https://codepen.io/WebSonata/">Anastasiya Kuligina</a> - <a href="https://codepen.io/WebSonata/pen/bRaONB">Anastasiya Kuligina example on codepen.io</a></li>

## License

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
