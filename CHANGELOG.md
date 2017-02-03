# 3.0.0
### Breaking changes
- Hammerjs is a mandatory library (install it with `npm install --save hammerjs @types/hammerjs`)
- `(cancelEvent)="myfunction($event)"` replaced by `(isClosed)="myfunction($event)"`
- `<imageModal></imageModal>` replaced by `<image-modal></image-modal>`

### New features
- new output events available: `(visibleIndex)="myfunction($event)"`, `(isFirstImage)="myfunction($event)"`, `(isLastImage)="myfunction($event)"`
- new classes/enums available: `Image`, `Action`, `ImageModalEvent`
    - `Image` is the input class with the following string properties: `thumb`, `img`, `description`.
    - `Action` is the enum that specify the origin of the action. It can be `NORMAL`, `CLICK`, `KEYBOARD`, `SWIPE`.
    - `ImageModalEvent` is the output class emitted as content of an event. It contains both an `Action` and a result (boolean or number).
- `myfunction(event: ImageModalEvent)` can use the Action name as a string with this syntax: `Action[event.action]`


# 2.0.2
### Developers and users of this library
- description is now displayed correctly (issue #21)
- documentation improvements

### Myself and other contributor of this project
- npm scripts improved with `ncp` and `mkdirp`
- added `prebuild` and `postbuild` scripts
- building process improved to prevent some errors


# 2.0.0 + 2.0.1
- Stability improvements + bugfixes
- CI support improved but still WIP
- documentation improvements


# alpha.1
- first release based on `vimalavinisha/angular2-image-popup`
- AOT support
- Angular 4 compatibility
- New build system with rollup js
- Experimental CI support
- Two official demo applications (systemjs + webpack 2)
- Live demo with webpack available at https://ks89.github.io/angular-modal-gallery/