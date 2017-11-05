# 4.0.1
### Chores
- Add LICENSE and other .md files to the released bundle


# 4.0.0
### Features
- #83 #101 Angular 5.x.x support
- #100 [Angular Package Format v4.0]( https://goo.gl/AMOU5G) support (very important feature)

### Bugfixes
- #101 remove dependencies and devDependencies from /angular-modal-gallery/package.json

### BREAKING CHANGES
- **Angular 2 is no longer officially supported**, please upgrade to Angular >= 4
- SystemJs users have to change their `systemjs.config.js` from
```
let map = {
    ...
    'angular-modal-gallery'     : 'node_modules/angular-modal-gallery/dist/bundles',
    ...
  };
```

to:
```
let map = {
    ...
    'angular-modal-gallery'     : 'node_modules/angular-modal-gallery/bundles',
    ...
  };
```

This is required by [Angular Package Format v4.0]( https://goo.gl/AMOU5G) specifications.

A special thanks to [maxkorz](https://github.com/maxkorz) for the support.


# 4.0.0-rc.2
### Bugfixes
- #101 remove dependencies and devDependencies from /angular-modal-gallery/package.json

See 4.0.0-rc.1 for other info.


# 4.0.0-rc.1
### Features
- #83 #101 Angular 5.x.x support
- #100 [Angular Package Format v4.0]( https://goo.gl/AMOU5G) support (very important feature)

### BREAKING CHANGES
- SystemJs users have to change their `systemjs.config.js` from
```
let map = {
    ...
    'angular-modal-gallery'     : 'node_modules/angular-modal-gallery/dist/bundles',
    ...
  };
```

to:
```
let map = {
    ...
    'angular-modal-gallery'     : 'node_modules/angular-modal-gallery/bundles',
    ...
  };
```

This is required by [Angular Package Format v4.0]( https://goo.gl/AMOU5G) specifications.



# 3.3.5
### Chores
- #96 Update FAQ with question "Error: No provider for KeyboardService!"

### Docs
- #97 [DOC] fix wrong introduction in demo/no-infinite-sliding
- #93 [DOC] fix wrong introduction in demo/keyboard-config


# 3.3.4
### Chores
- Update official webpack demo to bootstrap 4 beta #87
- refactoring and cleanup + tslint improved + ci improved #88
- Update docs + add faqs + create templates for github #75
- update to circleci 2.0 and add circleci 2.0 also to the doc website #78
- update all dependencies
- fix config for all CIs

### Docs
- Fix documentation website to be able to navigate to inner routes directly #86


# 3.3.3
### Bug fixes
- Fix for version 3.3.2 (broken)


# 3.3.2
### Internal library changes
- Revert refactoring of 3.3.1


# 3.3.1
### Internal library changes
- Small refactoring
- #73 Trying to fix again "ERROR in Error encountered resolving symbol values statically. Function calls are not supported. Consider replacing the function or lambda with a reference to an exported function ..."


# 3.3.0
### New features
- #41 KeyboardService should be capable to receive an object with an array of shortcuts from outside to configure Mousetrap. This is available as Global configuration of the Root Module.

### Bug fixes
- #73 Fix again "ERROR in Error encountered resolving symbol values statically. Function calls are not supported. Consider replacing the function or lambda with a reference to an exported function ..."


# 3.2.3
Note: **revert version 3.2.2**

### Bug fixes
- #73 Fix again with a different approach this error: "ERROR in Error encountered resolving symbol values statically. Function calls are not supported. Consider replacing the function or lambda with a reference to an exported function ..."


# 3.2.2
### Bug fixes
- #73 Fix: "ERROR in Error encountered resolving symbol values statically. Function calls are not supported. Consider replacing the function or lambda with a reference to an exported function ..."


# 3.2.1
- all dependencies updated
- #71 'ButtonsConfig' was not found in './modal-gallery.component' (bug of angular-cli -> I used a temporary workaround)


# 3.2.0
### New features
- #62 add 'alt' attribute to all img tags
- #45 Both at the beginning and at the end, side arrows should be hidden
- #44 Infinite sliding (configurable)

### Docs
- official documentation updated [HERE](https://ks89.github.io/angular-modal-gallery.github.io/).

### Demos
- all demos updated

### Internal library changes
- #66 improve unit testing with swipe events


# 3.1.1
- fix error in README.md


# 3.1.0
### New features
- #43 `ButtonsConfig` object to configure button's visibility
- #57 `KeyboardConfig` object to customize keyboard's actions (replacing `esc`, `left arrow`, `right arrow`, with other keys)
- #40 new @Input to enable Click outside Directive to close modal-gallery clicking on the semi-transparent background
- #67 Angular 2 is still supported

### Docs
- official documentation updated [HERE](https://ks89.github.io/angular-modal-gallery.github.io/).

### Demos
- #68 angular-cli demo updated to the latest release of angular-cli and with 3 new live examples for angular-modal-gallery 3.1.0
- #68 webpack and systemjs demos updated with 3 new live examples for angular-modal-gallery 3.1.0

### Bug fixes
- #64 hasData event emitted multiple time while initializing the component
- #65 wrong result into ImageModalEvent when clicking left arrow button

### Chores
- #63 Add minimum IE version supported by this library (IE 11)

### Internal library changes
- #14 unit testing
- #59 basic tslint config for angular-modal-gallery lib
- #69 improve CIs config for unit testing (adding also coveralls ad codeclimate's reports)
- #60 build env with npm>=5.0.0 and node>=8.0.0
- #61 replace elementref with renderer to prepare this project to angular-universal (still not supported, but this is the first step)


# 3.0.2
### Chores
- Angular 4.1.0 #50
- dependencies updated

### Docs
- Improved official documentation website (scroll bug fixed #47 and improved responsiveness #38)
- dependencies updated

### Demos
- tslint 5 in all demos #54
- Official demos: IE performance issue with debug mode #51
- dependencies updated


# 3.0.1

### Bug fixes
- readme fix wrong link (exactly the same library of 3.0.0)


# 3.0.0
**THIS VERSION IS A VERY BIG RELEASE. IF YOU WANT TO MIGRATE FROM 2.x.x to 3.0.0 PLEASE CHECK THE OFFICIAL DOCUMENTATION [HERE](https://ks89.github.io/angular-modal-gallery.github.io/)**

### Breaking changes
- `hammerjs` and `mousetrap` are mandatory libraries (install they with `npm install --save hammerjs mousetrap`).
- `(cancelEvent)="myfunction($event)"` replaced by `(close)="myfunction($event)"`.
- `<imageModal></imageModal>` replaced by `<modal-gallery></modal-gallery>`.
- You have to init input images with an `Array<Image>` or an `Observable<Array<Image>>` as explained [HERE](https://ks89.github.io/angular-modal-gallery.github.io/).

### New features
- swipe support for mobile devices with touch-screen.
- optional thumbnail (if you provide only the bigger version, this library will scale down your image).
- downloadable images with both a button and keyboard shortcuts. You have to set `[downloadable]="true"` and `[showExtUrlButton]="true"`.
- optional external url button. You have to set `[showExtUrlButton]="true"`.
- fully configurable description using `[description]="yourDescriptionInterfaceVariable"` passing `Description` interface with `customFullDescription`, `imageText`, `numberSeparator`, `beforeTextDescription`.
If you pass `customFullDescription`, all the others will be overwritten.
- new output events available: `(hasData)="myfunction($event)"`, `(show)="myfunction($event)"`, `(firstImage)="myfunction($event)"`, `(lastImage)="myfunction($event)"`.
- new classes/enums exported and available to all users: `Image`, `Action`, `ImageModalEvent`, `Description`.
    - `Image` is the input class with the following (mandatory) string properties: `thumb`, `img`, `description` and `extUrl`.
    - `Action` is the enum that specify the origin of the action. It can be `NORMAL`, `CLICK`, `KEYBOARD`, `SWIPE`, `LOAD`.
    - `ImageModalEvent` is the output class emitted as payload of an event. It contains both an `Action` and a result (boolean or number).
    - `Description` is the description interface with `customFullDescription`, `imageText`, `numberSeparator`, `beforeTextDescription`.
- `myfunction(event: ImageModalEvent)` can use the Action name as a string with this syntax: `Action[event.action]`, because I exported `Action` enum to all users.
- support for `ModalGalleryModule.forRoot()` to import this module inside your root module (as recommended by Angular). For a child NgModule, you must use simply `ModalGalleryModule`.

### Docs
- official documentation (bootstrap-like :)) with live demo, migration guide and features showcase [HERE](https://ks89.github.io/angular-modal-gallery.github.io/).

### Demos
- new angular-cli official demo inside `demo/angular-cli`
- official systemjs demo updated to 0.20.x with some breaking changes.
- official webpack demo updated to Angular 4 RC :)

### Internal library changes
- big refactoring splitting the sourcecode and using directives, services, sub-components and so on.
- new library structure thanks to [cankayacan](https://github.com/cankayacan/ngx-library-starter).
- css rewritten using scss and a dedicated rollup's plugin.

### Bug fixes
- lot of bug fixes everywhere (.ts, .css but also for mobile devices) :).


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
