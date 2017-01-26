# Angular modal gallery (--- work in progress ---)

An Angular library to create an image gallery of clickable thumbnails. After a click, it displays a modal window with the large image.
It's also possible to navigate between these images with keyboard arrows and close it with esc.
More features coming soon!

This project was born as a fork of [THIS REPO](https://github.com/vimalavinisha/angular2-image-popup).

**This library uses [Semantic versioning 2.0.0](http://semver.org/) also known as 'semver'**

## Features
- Angular module with a directive inside
- AOT support
- Angular >=2 (it's also working with Angular 4 beta)
- Tested with Webpack2 + Treeshaking and inside a Lazy loaded module
- and so on...

## News

COMING SOON

- 01/??/2017 - 2.0.0 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)


## Installation

- npm: `STILL NOT AVAILABLE`
- bower `STILL NOT AVAILABLE`


## Demo website

[GO HERE FOR A DEMO](https://ks89.github.io/angular-modal-gallery/)


## Setup

### Webpack (recommended)

check the official demo in `demo/webpack` and the live example [HERE](https://ks89.github.io/angular-modal-gallery/), compiled with `npm run build:aot:github`

To be able to run it follow these steps

1. `npm i` (from the root folder of this project)
2. `npm run build`
3. `sudo npm run link` (requires sudo)
3. `cd demo/webpack`
4. `npm i`
5. `npm run link` (sudo not required here)
6. `npm start`

To build as dev
- `npm run build:dev`

To build as prod without aot
- `npm run build:prod`

To build as prod with aot
- `npm run build:prod:aot`

To deploy this application on github
- `npm run build:aot:github` and push `docs` folder.

### Systemjs

check the official demo in `demo/systemjs` (not for production)

To be able to run it follow these steps

1. `npm i` (from the root folder of this project)
2. `npm run build`
3. `sudo npm run link` (requires sudo)
3. `cd demo/systemjs`
4. `npm i`
5. `npm run link` (sudo not required here)
6. `npm start`

### Angular-cli (COMING SOON)

TODO


## Contributing

TODO


## Developer informations

TODO


## License

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
