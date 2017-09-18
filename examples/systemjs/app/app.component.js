"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var angular_modal_gallery_1 = require("angular-modal-gallery");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/of");
require("rxjs/add/operator/delay");
var AppComponent = /** @class */ (function () {
    function AppComponent() {
        this.openModalWindow = false;
        this.imagePointer = 0;
        this.openModalWindowObservable = false;
        this.imagePointerObservable = 0;
        this.imagesArray = [
            new angular_modal_gallery_1.Image(0, './app/assets/images/gallery/img1.jpg', null, // no thumb
            null, // no description
            'http://www.google.com'),
            new angular_modal_gallery_1.Image(1, './app/assets/images/gallery/img2.png', // example with a PNG image
            null, // no thumb
            'Description 2', null // url
            ),
            new angular_modal_gallery_1.Image(2, './app/assets/images/gallery/img3.jpg', './app/assets/images/gallery/thumbs/img3.png', // example with a PNG thumb image
            'Description 3', 'http://www.google.com'),
            new angular_modal_gallery_1.Image(3, './app/assets/images/gallery/img4.jpg', null, // no thumb
            'Description 4', 'http://www.google.com'),
            new angular_modal_gallery_1.Image(4, './app/assets/images/gallery/img5.jpg', './app/assets/images/gallery/thumbs/img5.jpg', null, // no description
            null // url
            )
        ];
        // observable of an array of images with a delay to simulate a network request
        this.images = Observable_1.Observable.of(this.imagesArray).delay(300);
        // array with a single image inside (the first one)
        this.singleImage = Observable_1.Observable.of([
            new angular_modal_gallery_1.Image('./app/assets/images/gallery/img1.jpg', './app/assets/images/gallery/thumbs/img1.jpg', 'Description 1', 'http://www.google.com')
        ]);
        this.customDescription = {
            imageText: 'Look this image ',
            numberSeparator: ' of ',
            beforeTextDescription: ' => '
        };
        this.customFullDescription = {
            // you should build this value programmaticaly with the result of (show)="..()" event
            customFullDescription: 'Custom description of the current visible image',
        };
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.imagesArraySubscription = Observable_1.Observable.of(null).delay(500).subscribe(function () {
            _this.imagesArraySubscribed = _this.imagesArray;
        });
    };
    AppComponent.prototype.openImageModal = function (image) {
        this.imagePointer = this.imagesArray.indexOf(image);
        this.openModalWindow = true;
    };
    AppComponent.prototype.openImageModalObservable = function (image) {
        var _this = this;
        this.subscription = this.images.subscribe(function (val) {
            _this.imagePointerObservable = val.indexOf(image);
            _this.openModalWindowObservable = true;
        });
    };
    AppComponent.prototype.onImageLoaded = function (event) {
        // angular-modal-gallery will emit this event if it will load successfully input images
        console.log('onImageLoaded action: ' + angular_modal_gallery_1.Action[event.action]);
        console.log('onImageLoaded result:' + event.result);
    };
    AppComponent.prototype.onVisibleIndex = function (event) {
        this.customFullDescription.customFullDescription = "Custom description of visible image with index= " + event.result;
        console.log('action: ' + angular_modal_gallery_1.Action[event.action]);
        console.log('result:' + event.result);
    };
    AppComponent.prototype.onIsFirstImage = function (event) {
        console.log('onfirst action: ' + angular_modal_gallery_1.Action[event.action]);
        console.log('onfirst result:' + event.result);
    };
    AppComponent.prototype.onIsLastImage = function (event) {
        console.log('onlast action: ' + angular_modal_gallery_1.Action[event.action]);
        console.log('onlast result:' + event.result);
    };
    AppComponent.prototype.onCloseImageModal = function (event) {
        console.log('onClose action: ' + angular_modal_gallery_1.Action[event.action]);
        console.log('onClose result:' + event.result);
        this.openModalWindow = false;
        this.openModalWindowObservable = false;
    };
    AppComponent.prototype.addRandomImage = function () {
        var newImage = Object.assign({}, this.imagesArray[Math.floor(Math.random() * this.imagesArray.length)], { id: this.imagesArray.length - 1 + 1 });
        this.imagesArray.push(newImage);
    };
    AppComponent.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.imagesArraySubscription) {
            this.imagesArraySubscription.unsubscribe();
        }
    };
    AppComponent.prototype.trackById = function (index, item) {
        return item.id;
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            styleUrls: ['./app/main.css'],
            template: "\n    <h1>angular-modal-gallery official systemjs demo</h1>\n    <hr>\n    <p>If you want, you can <b>add a random image</b> to every example\n      <button (click)=\"addRandomImage()\">Add image</button>\n    </p>\n    <br>\n    <hr>\n    <p class=\"red-text center-text\"><b>--- Only from version 3.2.x or greater ---</b></p>\n    <section id=\"Images32-1\">\n      <h3>1 - Array of images + slideConfig (without infinite sliding)</h3>\n      <p>modalGallery with</p>\n      <ul>\n        <li>modalImages is an <b>Array&lt;Image&gt;</b></li>\n        <li><b>no downloadable</b> images, because downloadable = false (showDownloadButton is false by default)</li>\n        <li><b>default description</b>, for instance Image 2/5 - Description 1'</li>\n        <li><b>infinite sliding disabled</b> because, <u class=\"red-text\">slideConfig.infinite = false</u></li>\n        <li>subscribed to all outputs (hasData, close, show, firstImage, lastImage)</li>\n      </ul>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"></ks-modal-gallery>\n    </section>\n    <hr>\n    <br>\n    <br>\n    <p class=\"red-text center-text\"><b>--- Only from version 3.1.x or greater ---</b></p>\n    <section id=\"Images31-1\">\n      <h3>2 - Array of images + download (both 'ctrl+s' and button) <span class=\"red-text\">with 'buttonsConfig' and 'clickOutside'</span></h3>\n      <p>modalGallery with</p>\n      <ul>\n        <li>modalImages is an <b>Array&lt;Image&gt;</b></li>\n        <li><b>downloadable</b> images, because downloadable = true. So you can use <b>ctrl+s</b> to download the current image</li>\n        <li><b>download button NOT visible</b> because, <u class=\"red-text\">buttonsConfig.download = false</u></li>\n        <li><b>external url button NOT visible</b> (because <u class=\"red-text\">buttonsConfig.extUrl=false</u>)</li>\n        <li><b>default keyboard config</b> because, <u class=\"red-text\">[keyboardConfig] is not defined</u>, so it will use default values (esc, left and right arrows)</li>\n        <li><b>close clicking on background</b> because, <u class=\"red-text\">[enableCloseOutside]</u> is true</li>\n        <li><b>custom full description</b>, passing and object with <b>customFullDescription:</b> 'Custom full string description, Image=2'</li>\n        <li>subscribed to all outputs (hasData, close, show, firstImage, lastImage)</li>\n      </ul>\n      <br>\n      <ks-modal-gallery [modalImages]=\"imagesArray\"\n                        [buttonsConfig]=\"{download: false, extUrl: false, close: true}\"\n                        [downloadable]=\"true\"\n                        [enableCloseOutside]=\"true\"\n                        [description]=\"customFullDescription\"\n                        (hasData)=\"onImageLoaded($event)\"\n                        (close)=\"onCloseImageModal($event)\"\n                        (show)=\"onVisibleIndex($event)\"\n                        (firstImage)=\"onIsFirstImage($event)\"\n                        (lastImage)=\"onIsLastImage($event)\"></ks-modal-gallery>\n    </section>\n    <section id=\"Images31-2\">\n      <h3>3 - Observable of images with delay(300) + download (both 'ctrl+s' and button) <span class=\"red-text\">with 'buttonsConfig' and 'keyboardConfig'</span></h3>\n      <p>modalGallery with</p>\n      <ul>\n        <li>modalImages is an <b>Observable&lt;<b>Array&lt;Image&gt;</b>&gt;</b> with 300ms of delay (to simulate a network request)</li>\n        <li><b>downloadable</b> images, because downloadable = true. So you can use <b>ctrl+s</b> to download the current image</li>\n        <li><b>download button visible</b> because, <u class=\"red-text\">buttonsConfig.download = true</u> and downloadable is also = true</li>\n        <li><b>external url button visible</b> (because <u class=\"red-text\">buttonsConfig.extUrl=true</u>), only if you provide as url a valid value (null/undefined hide the\n          button)\n        </li>\n        <li><b>custom keyboard's config</b> because, <u class=\"red-text\">[keyboardConfig] is passed, so esc is remapped to 'q' (81), left to 'arrow down' (40), and right to 'arrow\n          up' (38)</u></li>\n        <li><b>NO close clicking on background</b> because, <u class=\"red-text\">[enableCloseOutside]</u> is false</li>\n        <li><b>default description</b>, for instance Image 2/5 - Description 1'</li>\n        <li>subscribed to all outputs (hasData, close, show, firstImage, lastImage)</li>\n      </ul>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [buttonsConfig]=\"{download: true, extUrl: true, close: true}\"\n                        [keyboardConfig]=\"{esc: 81, left: 40, right: 38}\"\n                        [downloadable]=\"true\"\n                        [enableCloseOutside]=\"false\"\n                        (hasData)=\"onImageLoaded($event)\"\n                        (close)=\"onCloseImageModal($event)\"\n                        (show)=\"onVisibleIndex($event)\"\n                        (firstImage)=\"onIsFirstImage($event)\"\n                        (lastImage)=\"onIsLastImage($event)\"></ks-modal-gallery>\n    </section>\n    <section id=\"Images31-3\">\n      <h3>4 - Array of images without close button thanks to <span class=\"red-text\">'buttonsConfig'</span></h3>\n      <p>modalGallery with</p>\n      <ul>\n        <li>modalImages is an <b>Array&lt;Image&gt;</b></li>\n        <li><b>download button NOT visible</b> because, <u class=\"red-text\">buttonsConfig.download = false</u></li>\n        <li><b>external url button visible</b> (because <u class=\"red-text\">buttonsConfig.extUrl=true</u>), only if you provide as url a valid value (null/undefined hide the\n          button)\n        </li>\n        <li><b>close button NOT visible</b> because, <u class=\"red-text\">buttonsConfig.close = false</u></li>\n        <li><b>default keyboard config</b> because, <u class=\"red-text\">[keyboardConfig] is not defined</u>, so it will use default values (esc, left and right arrows)</li>\n        <li><b>close clicking on background</b> because, <u class=\"red-text\">[enableCloseOutside]</u> is true</li>\n        <li><b>custom full description</b>, passing and object with <b>customFullDescription:</b> 'Custom full string description, Image=2'</li>\n        <li>subscribed to all outputs (hasData, close, show, firstImage, lastImage)</li>\n      </ul>\n      <br>\n      <ks-modal-gallery [modalImages]=\"imagesArray\"\n                        [buttonsConfig]=\"{download: false, extUrl: true, close: false}\"\n                        [enableCloseOutside]=\"true\"\n                        [description]=\"customFullDescription\"\n                        (hasData)=\"onImageLoaded($event)\"\n                        (close)=\"onCloseImageModal($event)\"\n                        (show)=\"onVisibleIndex($event)\"\n                        (firstImage)=\"onIsFirstImage($event)\"\n                        (lastImage)=\"onIsLastImage($event)\"></ks-modal-gallery>\n    </section>\n    <hr>\n    <br>\n    <br>\n    <p class=\"center-text\"><b>--- For all 3.x.x versions ---</b></p>\n    <section id=\"Images1\">\n      <h3>5 - Observable of images with delay(300)</h3>\n      <p>modalGallery with</p>\n      <ul>\n        <li>modalImages is an <b>Observable&lt;<b>Array&lt;Image&gt;</b>&gt;</b> with 300ms of delay (to simulate a network request)</li>\n        <li><b>no downloadable</b> images, because downloadable = false (showDownloadButton is false by default)</li>\n        <li><b>external url</b> button visible (because [showExtUrlButton]=\"true\"), only if you provide as url a valid value (null/undefined hide the button)</li>\n        <li><b>custom description</b> object = <b>imageText:</b> 'Look this image ', <b>numberSeparator:</b>' of ', <b>beforeTextDescription:</b>' => '</li>\n        <li>subscribed to all outputs (hasData, close, show, firstImage, lastImage)</li>\n      </ul>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [downloadable]=\"false\"\n                        [description]=\"customDescription\"\n                        (hasData)=\"onImageLoaded($event)\"\n                        (close)=\"onCloseImageModal($event)\"\n                        (show)=\"onVisibleIndex($event)\"\n                        (firstImage)=\"onIsFirstImage($event)\"\n                        (lastImage)=\"onIsLastImage($event)\"></ks-modal-gallery>\n    </section>\n    <section id=\"Images2\">\n      <h3>6 - Observable of images with delay(300) + download (both 'ctrl+s' and button)</h3>\n      <p>modalGallery with</p>\n      <ul>\n        <li>modalImages is an <b>Observable&lt;<b>Array&lt;Image&gt;</b>&gt;</b> with 300ms of delay (to simulate a network request)</li>\n        <li><b>downloadable</b> images, because downloadable = true. So you can use <b>ctrl+s</b> to download the current image</li>\n        <li><b>download button displayed</b> because, showDownloadButton = true and downloadable is also = true</li>\n        <li><b>external url button visible</b> (because [showExtUrlButton]=\"true\"), only if you provide as url a valid value (null/undefined hide the button)</li>\n        <li><b>default description</b>, for instance Image 2/5 - Description 1'</li>\n        <li>subscribed to all outputs (hasData, close, show, firstImage, lastImage)</li>\n      </ul>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [downloadable]=\"true\"\n                        (hasData)=\"onImageLoaded($event)\"\n                        (close)=\"onCloseImageModal($event)\"\n                        (show)=\"onVisibleIndex($event)\"\n                        (firstImage)=\"onIsFirstImage($event)\"\n                        (lastImage)=\"onIsLastImage($event)\"></ks-modal-gallery>\n    </section>\n    <section id=\"Images3\">\n      <h3>7 - Array of images + download (both 'ctrl+s' and button)</h3>\n      <p>modalGallery with</p>\n      <ul>\n        <li>modalImages is an <b>Array&lt;Image&gt;</b></li>\n        <li><b>downloadable</b> images, because downloadable = true. So you can use <b>ctrl+s</b> to download the current image</li>\n        <li><b>download button displayed</b> because, showDownloadButton = true and downloadable is also = true</li>\n        <li><b>external url button NOT visible</b> (because [showExtUrlButton]=\"false\")</li>\n        <li><b>custom full description</b>, passing and object with <b>customFullDescription:</b> 'Custom full string description, Image=2'</li>\n        <li>subscribed to all outputs (hasData, close, show, firstImage, lastImage)</li>\n      </ul>\n      <br>\n      <ks-modal-gallery [modalImages]=\"imagesArray\"\n                        [downloadable]=\"true\"\n                        [description]=\"customFullDescription\"\n                        (hasData)=\"onImageLoaded($event)\"\n                        (close)=\"onCloseImageModal($event)\"\n                        (show)=\"onVisibleIndex($event)\"\n                        (firstImage)=\"onIsFirstImage($event)\"\n                        (lastImage)=\"onIsLastImage($event)\"></ks-modal-gallery>\n    </section>\n    <section id=\"Images4\">\n      <br>\n      <h3>8 - Observable of images with a single element and without a delay</h3>\n      <p>modalGallery with</p>\n      <ul>\n        <li>modalImages is an <b>Observable&lt;Array&lt;Image&gt;&gt;</b> without delay</li>\n        <li><b>no downloadable</b>, because both showDownloadButton and downloadable are false by default</li>\n        <li><b>external url button NOT visible</b> (because [showExtUrlButton] is not defined, but is false by default)</li>\n        <li><b>default description</b>, for instance Image 2/5 - Description 1'</li>\n        <li>subscribed to all outputs (hasData, close, show, firstImage, lastImage)</li>\n      </ul>\n      <br>\n      <!-- both showDownloadButton and downloadable are false by default -->\n      <ks-modal-gallery [modalImages]=\"singleImage\"\n                        (hasData)=\"onImageLoaded($event)\"\n                        (close)=\"onCloseImageModal($event)\"\n                        (show)=\"onVisibleIndex($event)\"\n                        (firstImage)=\"onIsFirstImage($event)\"\n                        (lastImage)=\"onIsLastImage($event)\"></ks-modal-gallery>\n    </section>\n    <section id=\"Images5\">\n      <br>\n      <h3>9 - Array with thumbnail pointers + download (only 'ctrl+s', without button)</h3>\n      <p>modalGallery with</p>\n      <ul>\n        <li>modalImages is an <b>Array&lt;Image&gt;</b></li>\n        <li><b>imagePointer as input</b></li>\n        <li><b>downloadable images only using ctrl+s</b>, because both downloadable = true, but showDownloadButton is false by default</li>\n        <li><b>external url button visible</b> (because [showExtUrlButton]=\"true\"), only if you provide as url a valid value (null/undefined hide the button)</li>\n        <li><b>default description</b>, for instance Image 2/5 - Description 1'</li>\n        <li>subscribed to all outputs (hasData, close, show, firstImage, lastImage)</li>\n      </ul>\n      <br>\n      <div *ngFor=\"let img of imagesArray; trackBy: trackById; let i = index\">\n        <div class=\"float-left\" *ngIf=\"i <= 2\">\n          <a class=\"more\" *ngIf=\"i==2\" (click)=\"openImageModal(img)\"> +{{imagesArray.length - 3}} more </a>\n          <img *ngIf=\"img.thumb\" class=\"list-img\" src=\"{{img.thumb}}\" (click)=\"openImageModal(img)\" alt='{{img.description}}'/>\n          <img *ngIf=\"!img.thumb\" class=\"list-img\" src=\"{{img.img}}\" (click)=\"openImageModal(img)\" alt='{{img.description}}'/>\n        </div>\n      </div>\n      <div *ngIf=\"openModalWindow\">\n        <ks-modal-gallery [modalImages]=\"imagesArray\"\n                          [downloadable]=\"true\"\n                          (hasData)=\"onImageLoaded($event)\"\n                          (close)=\"onCloseImageModal($event)\"\n                          (show)=\"onVisibleIndex($event)\"\n                          (firstImage)=\"onIsFirstImage($event)\"\n                          (lastImage)=\"onIsLastImage($event)\"></ks-modal-gallery>\n      </div>\n    </section>\n    <br><br>\n    <section id=\"Images6\">\n      <br>\n      <h3>10 - Observable with thumbnail pointers and delay(300) + download (only 'ctrl+s', without button)</h3>\n      <p>modalGallery with</p>\n      <ul>\n        <li>modalImages is an <b>Observable&lt;Array&lt;Image&gt;&gt;</b> with 300ms of delay (to simulate a network request)</li>\n        <li><b>imagePointer as input</b></li>\n        <li><b>downloadable images only using ctrl+s</b>, because both downloadable = true, but showDownloadButton is false by default</li>\n        <li><b>external url button NOT visible</b> (because [showExtUrlButton]=\"false\")</li>\n        <li>subscribed to all outputs (hasData, close, show, firstImage, lastImage)</li>\n      </ul>\n      <br>\n      <div *ngFor=\"let img of images | async; trackBy: trackById; let i = index\">\n        <div class=\"float-left\" *ngIf=\"i <= 2\">\n          <a class=\"more\" *ngIf=\"i==2\" (click)=\"openImageModalObservable(img)\"> +{{(images | async)?.length - 3}}\n            more </a>\n          <img *ngIf=\"img.thumb\" class=\"list-img\" src=\"{{img.thumb}}\" (click)=\"openImageModalObservable(img)\" alt='{{img.description}}'/>\n          <img *ngIf=\"!img.thumb\" class=\"list-img\" src=\"{{img.img}}\" (click)=\"openImageModalObservable(img)\" alt='{{img.description}}'/>\n        </div>\n      </div>\n      <div *ngIf=\"openModalWindowObservable\">\n        <ks-modal-gallery [modalImages]=\"images\"\n                          [downloadable]=\"true\"\n                          (hasData)=\"onImageLoaded($event)\"\n                          (close)=\"onCloseImageModal($event)\"\n                          (show)=\"onVisibleIndex($event)\"\n                          (firstImage)=\"onIsFirstImage($event)\"\n                          (lastImage)=\"onIsLastImage($event)\"></ks-modal-gallery>\n      </div>\n    </section>\n    <br><br>\n    <section id=\"Images7\">\n      <br>\n      <h3>11 - Array of images initialized inside a .subscribe() of an Observable with delay(500)</h3>\n      <p>modalGallery with</p>\n      <ul>\n        <li>modalImages is an <b>Array&lt;Image&gt;</b> initialized inside a subscribe to simulate a more realistic scenario</li>\n        <li><b>no downloadable</b>, because both showDownloadButton and downloadable are false by default</li>\n        <li><b>external url button NOT visible</b> (because [showExtUrlButton] is not defined, but is false by default)</li>\n        <li><b>default description</b>, for instance Image 2/5 - Description 1'</li>\n        <li>subscribed to all outputs (hasData, close, show, firstImage, lastImage)</li>\n      </ul>\n      <br>\n      <ks-modal-gallery [modalImages]=\"imagesArraySubscribed\"\n                        (hasData)=\"onImageLoaded($event)\"\n                        (close)=\"onCloseImageModal($event)\"\n                        (show)=\"onVisibleIndex($event)\"\n                        (firstImage)=\"onIsFirstImage($event)\"\n                        (lastImage)=\"onIsLastImage($event)\"></ks-modal-gallery>\n    </section>\n    <br><br>\n    <h4>Created by Stefano Cappa (Ks89)</h4>\n  "
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map