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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Input, Output, EventEmitter, HostListener, Component } from '@angular/core';
import 'rxjs/add/operator/elementAt';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/share';
import 'mousetrap';
export var Action;
(function (Action) {
    Action[Action["NORMAL"] = 0] = "NORMAL";
    Action[Action["CLICK"] = 1] = "CLICK";
    Action[Action["KEYBOARD"] = 2] = "KEYBOARD";
    Action[Action["SWIPE"] = 3] = "SWIPE";
    Action[Action["LOAD"] = 4] = "LOAD";
})(Action || (Action = {}));
export var ImageModalEvent = (function () {
    function ImageModalEvent(action, result) {
        this.action = action;
        this.result = result;
    }
    return ImageModalEvent;
}());
export var Image = (function () {
    function Image(thumb, img, description) {
        this.thumb = thumb;
        this.img = img;
        this.description = description;
    }
    return Image;
}());
export var Keyboard;
(function (Keyboard) {
    Keyboard[Keyboard["ESC"] = 27] = "ESC";
    Keyboard[Keyboard["LEFT_ARROW"] = 37] = "LEFT_ARROW";
    Keyboard[Keyboard["RIGHT_ARROW"] = 39] = "RIGHT_ARROW";
    Keyboard[Keyboard["UP_ARROW"] = 38] = "UP_ARROW";
    Keyboard[Keyboard["DOWN_ARROW"] = 40] = "DOWN_ARROW";
})(Keyboard || (Keyboard = {}));
export var AngularModalGallery = (function () {
    function AngularModalGallery() {
        this.opened = false;
        this.loading = false;
        this.showGallery = false;
        this.currentImageIndex = 0;
        // enum action used to pass a click action
        // when you clicks over the modal image.
        // Declared here  to use it in the template.
        this.clickAction = Action.CLICK;
        this.SWIPE_ACTION = {
            LEFT: 'swipeleft',
            RIGHT: 'swiperight',
            UP: 'swipeup',
            DOWN: 'swipedown'
        };
        this.showDownloadButton = false;
        this.isClosed = new EventEmitter();
        this.visibleIndex = new EventEmitter();
        this.isFirstImage = new EventEmitter();
        this.isLastImage = new EventEmitter();
        this.isImagesLoaded = new EventEmitter();
        Mousetrap.bind(['ctrl+s', 'meta+s'], function (e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            else {
                // internet explorer
                e.returnValue = false;
            }
            console.log("mousetrapped");
            if (this.showDownloadButton) {
                this.downloadImage(this.currentImage);
            }
        });
    }
    AngularModalGallery.prototype.onKeyDown = function (e) {
        if (!this.opened) {
            return;
        }
        switch (e.keyCode) {
            case Keyboard.ESC:
                this.closeGallery(Action.KEYBOARD);
                break;
            case Keyboard.RIGHT_ARROW:
                this.nextImage(Action.KEYBOARD);
                break;
            case Keyboard.LEFT_ARROW:
                this.prevImage(Action.KEYBOARD);
                break;
        }
    };
    AngularModalGallery.prototype.ngOnInit = function () {
        // required before showModalGallery, otherwise this.images will be undefined
        this.initImages();
        this.loading = true;
        if (this.imagePointer >= 0) {
            this.showGallery = false;
            this.showModalGallery(this.imagePointer);
        }
        else {
            this.showGallery = true;
        }
    };
    AngularModalGallery.prototype.initImages = function () {
        var _this = this;
        if (this.modalImages instanceof Array) {
            this.images = this.modalImages;
            this.isImagesLoaded.emit(new ImageModalEvent(Action.LOAD, true));
        }
        else {
            this.subscription = this.modalImages.subscribe(function (val) {
                _this.images = val;
                _this.isImagesLoaded.emit(new ImageModalEvent(Action.LOAD, true));
            });
        }
    };
    // hammerjs touch gestures support
    AngularModalGallery.prototype.swipe = function (index, action) {
        if (action === void 0) { action = this.SWIPE_ACTION.RIGHT; }
        switch (action) {
            case this.SWIPE_ACTION.RIGHT:
                this.nextImage(Action.SWIPE);
                break;
            case this.SWIPE_ACTION.LEFT:
                this.prevImage(Action.SWIPE);
                break;
        }
    };
    AngularModalGallery.prototype.closeGallery = function (action) {
        if (action === void 0) { action = Action.NORMAL; }
        this.opened = false;
        this.isClosed.emit(new ImageModalEvent(action, true));
    };
    AngularModalGallery.prototype.prevImage = function (action) {
        if (action === void 0) { action = Action.NORMAL; }
        this.loading = true;
        this.currentImageIndex = this.getPrevIndex(action, this.currentImageIndex);
        this.showModalGallery(this.currentImageIndex);
    };
    AngularModalGallery.prototype.nextImage = function (action) {
        if (action === void 0) { action = Action.NORMAL; }
        this.loading = true;
        this.currentImageIndex = this.getNextIndex(action, this.currentImageIndex);
        this.showModalGallery(this.currentImageIndex);
    };
    AngularModalGallery.prototype.showModalGallery = function (index) {
        this.currentImageIndex = index;
        this.opened = true;
        this.currentImage = this.images[this.currentImageIndex];
        this.loading = false;
    };
    AngularModalGallery.prototype.downloadImage = function (image) {
        if (!this.showDownloadButton) {
            return;
        }
        if (navigator.msSaveBlob) {
        }
        else {
            // other browsers
            var link = document.createElement('a');
            link.href = image.img;
            link.setAttribute('download', this.getFileName(image.img));
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    AngularModalGallery.prototype.getNextIndex = function (action, currentIndex) {
        var newIndex = 0;
        if (currentIndex >= 0 && currentIndex < this.images.length - 1) {
            newIndex = currentIndex + 1;
        }
        else {
            newIndex = 0; // start from the first index
        }
        // emit first/last event based on newIndex value
        this.emitBoundaryEvent(action, newIndex);
        // emit current visibile image index
        this.visibleIndex.emit(new ImageModalEvent(action, newIndex));
        return newIndex;
    };
    AngularModalGallery.prototype.getPrevIndex = function (action, currentIndex) {
        var newIndex = 0;
        if (currentIndex > 0 && currentIndex <= this.images.length - 1) {
            newIndex = currentIndex - 1;
        }
        else {
            newIndex = this.images.length - 1; // start from the last index
        }
        // emit first/last event based on newIndex value
        this.emitBoundaryEvent(action, newIndex);
        // emit current visibile image index
        this.visibleIndex.emit(new ImageModalEvent(action, newIndex));
        return newIndex;
    };
    AngularModalGallery.prototype.emitBoundaryEvent = function (action, indexToCheck) {
        // to emit first/last event
        switch (indexToCheck) {
            case 0:
                this.isFirstImage.emit(new ImageModalEvent(action, true));
                break;
            case this.images.length - 1:
                this.isLastImage.emit(new ImageModalEvent(action, true));
                break;
        }
    };
    AngularModalGallery.prototype.getFileName = function (path) {
        return path.replace(/^.*[\\\/]/, '');
    };
    AngularModalGallery.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    };
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], AngularModalGallery.prototype, "modalImages", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Number)
    ], AngularModalGallery.prototype, "imagePointer", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Boolean)
    ], AngularModalGallery.prototype, "showDownloadButton", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], AngularModalGallery.prototype, "isClosed", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], AngularModalGallery.prototype, "visibleIndex", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], AngularModalGallery.prototype, "isFirstImage", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], AngularModalGallery.prototype, "isLastImage", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], AngularModalGallery.prototype, "isImagesLoaded", void 0);
    __decorate([
        HostListener('window:keydown', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [KeyboardEvent]), 
        __metadata('design:returntype', void 0)
    ], AngularModalGallery.prototype, "onKeyDown", null);
    AngularModalGallery = __decorate([
        Component({
            selector: 'imageModal',
            exportAs: 'imageModal',
            template: "\n    <div class=\"ng-gallery\" *ngIf=\"showGallery\">\n      <div *ngFor=\"let i of images; let index = index\">\n        <img src=\"{{ i.thumb }}\" class=\"ng-thumb\" (click)=\"showModalGallery(index)\" alt=\"{{ i.description }}\"/>\n      </div>\n    </div>\n    <div class=\"ng-overlay\" *ngIf=\"opened\">\n      <div class=\"ng-gallery-content\">\n        <div class=\"uil-ring-css\" *ngIf=\"loading\">\n          <div></div>\n        </div>\n        <a class=\"download-image\" *ngIf=\"showDownloadButton\" (click)=\"downloadImage(currentImage)\"><i class=\"fa fa-download\"></i></a>\n        <a class=\"close-popup\" (click)=\"closeGallery()\"><i class=\"fa fa-close\"></i></a>\n        <a class=\"nav-left\" *ngIf=\"(images)?.length > 1\" (click)=\"prevImage()\"><i class=\"fa fa-angle-left\"></i></a>\n        <img *ngIf=\"!loading\" src=\"{{ currentImage.img }}\" (click)=\"nextImage(clickAction)\" class=\"effect\" (swipeleft)=\"swipe(currentImageIndex, $event.type)\" (swiperight)=\"swipe(currentImageIndex, $event.type)\"/>\n        <a class=\"nav-right\" *ngIf=\"(images)?.length > 1\" (click)=\"nextImage()\"><i class=\"fa fa-angle-right\"></i></a>\n        <span class=\"info-text\">{{ currentImageIndex + 1 }}/{{ images.length }} - {{ currentImage.description }}</span>\n      </div>\n    </div>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], AngularModalGallery);
    return AngularModalGallery;
}());
//# sourceMappingURL=angular-modal-gallery.component.js.map