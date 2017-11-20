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
var of_1 = require("rxjs/observable/of");
var delay_1 = require("rxjs/operators/delay");
var angular_modal_gallery_2 = require("angular-modal-gallery");
var angular_modal_gallery_3 = require("angular-modal-gallery");
var AppComponent = /** @class */ (function () {
    function AppComponent() {
        this.openModalWindow = false;
        this.imagePointer = 0;
        this.openModalWindowObservable = false;
        this.imagePointerObservable = 0;
        this.imagesArray = [
            new angular_modal_gallery_1.Image(0, '../app/assets/images/gallery/img1.jpg', null, // no thumb
            null, // no description
            'http://www.google.com'),
            new angular_modal_gallery_1.Image(1, '../app/assets/images/gallery/img2.png', // example with a PNG image
            null, // no thumb
            'Description 2', null // url
            ),
            new angular_modal_gallery_1.Image(2, '../app/assets/images/gallery/img3.jpg', '../app/assets/images/gallery/thumbs/img3.png', // example with a PNG thumb image
            'Description 3', 'http://www.google.com'),
            new angular_modal_gallery_1.Image(3, '../app/assets/images/gallery/img4.jpg', null, // no thumb
            'Description 4', 'http://www.google.com'),
            new angular_modal_gallery_1.Image(4, '../app/assets/images/gallery/img5.jpg', '../app/assets/images/gallery/thumbs/img5.jpg', null, // no description
            null // url
            )
        ];
        // observable of an array of images with a delay to simulate a network request
        this.images = of_1.of(this.imagesArray).pipe(delay_1.delay(300));
        // array with a single image inside (the first one)
        this.singleImage = of_1.of([
            new angular_modal_gallery_1.Image(1, '../app/assets/images/gallery/img1.jpg', '../app/assets/images/gallery/thumbs/img1.jpg', 'Description 1', 'http://www.google.com')
        ]);
        this.dotsConfig = {
            visible: false
        };
        this.previewConfig = {
            visible: false,
            number: 3,
            arrows: true,
            clickable: true,
            alwaysCenter: false,
            size: {
                width: 70,
                height: 70,
                unit: 'px'
            }
        };
        this.customDescription = {
            strategy: angular_modal_gallery_3.DescriptionStrategy.ALWAYS_VISIBLE,
            imageText: 'Look this image ',
            numberSeparator: ' of ',
            beforeTextDescription: ' => '
        };
        this.customDescriptionHideIfEmpty = {
            strategy: angular_modal_gallery_3.DescriptionStrategy.HIDE_IF_EMPTY,
            imageText: 'Look this image ',
            numberSeparator: ' of ',
            beforeTextDescription: ' => '
        };
        this.customFullDescription = {
            strategy: angular_modal_gallery_3.DescriptionStrategy.ALWAYS_VISIBLE,
            // you should build this value programmaticaly with the result of (show)="..()" event
            customFullDescription: 'Custom description of the current visible image',
        };
        this.customFullDescriptionHidden = {
            strategy: angular_modal_gallery_3.DescriptionStrategy.ALWAYS_HIDDEN,
            // you should build this value programmaticaly with the result of (show)="..()" event
            customFullDescription: 'Custom description of the current visible image',
        };
        // customButtonsSize: ButtonSize = {
        //   width: 10,
        //   height: 10,
        //   unit: 'px'
        // };
        this.buttonsConfigDefault = {
            visible: true,
            strategy: angular_modal_gallery_2.ButtonsStrategy.DEFAULT
        };
        this.buttonsConfigSimple = {
            visible: true,
            strategy: angular_modal_gallery_2.ButtonsStrategy.SIMPLE
        };
        this.buttonsConfigAdvanced = {
            visible: true,
            strategy: angular_modal_gallery_2.ButtonsStrategy.ADVANCED
        };
        this.buttonsConfigFull = {
            visible: true,
            strategy: angular_modal_gallery_2.ButtonsStrategy.FULL
        };
        this.customButtonsConfig = {
            visible: true,
            strategy: angular_modal_gallery_2.ButtonsStrategy.CUSTOM,
            buttons: [
                {
                    className: 'fa fa-plus white',
                    type: angular_modal_gallery_2.ButtonType.CUSTOM,
                    ariaLabel: 'custom plus aria label',
                    title: 'custom plus title',
                    fontSize: '20px'
                },
                {
                    className: 'fa fa-close white',
                    type: angular_modal_gallery_2.ButtonType.CLOSE,
                    ariaLabel: 'custom close aria label',
                    title: 'custom close title',
                    fontSize: '20px'
                },
                {
                    className: 'fa fa-refresh white',
                    type: angular_modal_gallery_2.ButtonType.REFRESH,
                    ariaLabel: 'custom refresh aria label',
                    title: 'custom refresh title',
                    fontSize: '20px'
                },
                {
                    className: 'fa fa-download white',
                    type: angular_modal_gallery_2.ButtonType.DOWNLOAD,
                    ariaLabel: 'custom download aria label',
                    title: 'custom download title',
                    fontSize: '20px'
                },
                {
                    className: 'fa fa-external-link white',
                    type: angular_modal_gallery_2.ButtonType.EXTURL,
                    ariaLabel: 'custom exturl aria label',
                    title: 'custom exturl title',
                    fontSize: '20px'
                }
            ]
        };
        this.previewConfigFiveImages = {
            visible: true,
            number: 1
        };
        this.previewConfigNoArrows = {
            visible: true,
            arrows: false
        };
        this.previewConfigNoClickable = {
            visible: true,
            clickable: false
        };
        this.previewConfigAlwaysCenter = {
            visible: true,
            alwaysCenter: true
        };
        this.previewConfigCustomSize = {
            visible: true,
            size: { width: 30, height: 30, unit: 'px' }
        };
        this.accessibilityConfig = {
            backgroundAriaLabel: 'CUSTOM Modal gallery full screen background',
            backgroundTitle: 'CUSTOM background title',
            modalGalleryContentAriaLabel: 'CUSTOM Modal gallery content',
            modalGalleryContentTitle: 'CUSTOM gallery content title',
            loadingSpinnerAriaLabel: 'CUSTOM The current image is loading. Please be patient.',
            loadingSpinnerTitle: 'CUSTOM The current image is loading. Please be patient.',
            mainContainerAriaLabel: 'CUSTOM Current image and navigation',
            mainContainerTitle: 'CUSTOM main container title',
            mainPrevImageAriaLabel: 'CUSTOM Previous image',
            mainPrevImageTitle: 'CUSTOM Previous image',
            mainNextImageAriaLabel: 'CUSTOM Next image',
            mainNextImageTitle: 'CUSTOM Next image',
            dotsContainerAriaLabel: 'CUSTOM Image navigation dots',
            dotsContainerTitle: 'CUSTOM dots container title',
            dotAriaLabel: 'CUSTOM Navigate to image number',
            previewsContainerAriaLabel: 'CUSTOM Image previews',
            previewsContainerTitle: 'CUSTOM previews title',
            previewScrollPrevAriaLabel: 'CUSTOM Scroll previous previews',
            previewScrollPrevTitle: 'CUSTOM Scroll previous previews',
            previewScrollNextAriaLabel: 'CUSTOM Scroll next previews',
            previewScrollNextTitle: 'CUSTOM Scroll next previews'
        };
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.imagesArraySubscription = of_1.of(null).pipe(delay_1.delay(500)).subscribe(function () {
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
    AppComponent.prototype.onButtonBeforeHook = function (event) {
        console.log('onButtonBeforeHook ', event);
        // Invoked after a click on a button, but before that the related
        // action is applied.
        // For instance: this method will be invoked after a click
        // of 'close' button, but before that the modal gallery
        // will be really closed.
        // You can check for button type to identify the clicked button
        // for instance
        // if (event === ButtonType.CLOSE) { // do something }
    };
    AppComponent.prototype.onButtonAfterHook = function (event) {
        console.log('onButtonAfterHook ', event);
        // Invoked after both a click on a button and its related action.
        // For instance: this method will be invoked after a click
        // of 'close' button and modal gallery is closed.
        // You can check for button type to identify the clicked button
        // for instance
        // if (event === ButtonType.CLOSE) { // do something }
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
            template: "\n    <h1>angular-modal-gallery official angular-cli demo</h1>\n    <hr>\n    <p>If you want, you can <b>add a random image</b> to every example\n      <button (click)=\"addRandomImage()\"><i class=\"fa fa-plus\" aria-hidden=\"true\"></i>&nbsp;&nbsp;Add image</button>\n    </p>\n    <br>\n    <hr>\n\n    <h2>Minimal examples</h2>\n    <section>\n      <h3>A1 - Minimal demo - all defaults</h3>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"></ks-modal-gallery>\n    </section>\n    <section>\n      <h3>A2 - Minimal demo - listen for events</h3>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        (hasData)=\"onImageLoaded($event)\"\n                        (close)=\"onCloseImageModal($event)\"\n                        (show)=\"onVisibleIndex($event)\"\n                        (firstImage)=\"onIsFirstImage($event)\"\n                        (lastImage)=\"onIsLastImage($event)\"\n                        (buttonBeforeHook)=\"onButtonBeforeHook($event)\"\n                        (buttonAfterHook)=\"onButtonAfterHook($event)\"></ks-modal-gallery>\n    </section>\n    <br>\n    <hr>\n    <br>\n    <h2>Simple examples</h2>\n    <section>\n      <h3>B1 - Simple demo - only current image and buttons (previews and dots are hidden)</h3>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [previewConfig]=\"{visible: false}\"\n                        [dotsConfig]=\"{visible: false}\"></ks-modal-gallery>\n    </section>\n    <section>\n      <h3>B2 - Simple demo - only current image (buttuns, previews and dots are hidden)</h3>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [buttonsConfig]=\"{visible: false, strategy: 1}\"\n                        [previewConfig]=\"{visible: false}\"\n                        [dotsConfig]=\"{visible: false}\"></ks-modal-gallery>\n    </section>\n    <section>\n      <h3>B3 - Simple demo - disable closeOutside</h3>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [enableCloseOutside]=\"false\"></ks-modal-gallery>\n    </section>\n    <section>\n      <h3>B4 - Simple demo - no downloadable at all</h3>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [downloadable]=\"false\"\n                        [buttonsConfig]=\"{visible: true, strategy: 3}\"></ks-modal-gallery>\n    </section>\n    <section>\n      <h3>B5 - Simple demo - no download button (only with keyboard)</h3>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [downloadable]=\"true\"\n                        [buttonsConfig]=\"{visible: true, strategy: 2}\"></ks-modal-gallery>\n    </section>\n    <section>\n      <h3>B6 - Simple demo - download with both button and keyboard</h3>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [downloadable]=\"true\"\n                        [buttonsConfig]=\"{visible: true, strategy: 3}\"></ks-modal-gallery>\n    </section>\n    <section>\n      <h3>B7 - Simple demo - infinite sliding but NO previews</h3>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [slideConfig]=\"{infinite: true, sidePreviews: {show: false}}\"></ks-modal-gallery>\n    </section>\n    <section>\n      <h3>B8 - Simple demo - infinite sliding and previews</h3>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [slideConfig]=\"{infinite: true, sidePreviews: {show: true, width: 100, height: 100, unit: 'px'}}\"></ks-modal-gallery>\n    </section>\n    <section>\n      <h3>B9 - Simple demo - disable loading spinner</h3>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [loadingConfig]=\"{enable: false, type: 1}\"></ks-modal-gallery>\n    </section>\n    <section>\n      <h3>B10 - Simple demo - loading spinner of type Standard</h3>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [loadingConfig]=\"{enable: true, type: 1}\"></ks-modal-gallery>\n    </section>\n    <section>\n      <h3>B11 - Simple demo - loading spinner of type Circular <span style=\"color:blue;\">find a better spinner</span></h3>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [loadingConfig]=\"{enable: true, type: 2}\"></ks-modal-gallery>\n    </section>\n    <section>\n      <h3>B12 - Simple demo - loading spinner of type Dots <span style=\"color:blue;\">find a better spinner</span></h3>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [loadingConfig]=\"{enable: true, type: 3}\"></ks-modal-gallery>\n    </section>\n\n\n    <section>\n      <h3>B13 - Simple demo - buttons config DEFAULT strategy (only close)</h3>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [buttonsConfig]=\"buttonsConfigDefault\"></ks-modal-gallery>\n    </section>\n    <section>\n      <h3>B14 - Simple demo - buttons config SIMPLE strategy (close and download)</h3>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [buttonsConfig]=\"buttonsConfigSimple\"></ks-modal-gallery>\n    </section>\n    <section>\n      <h3>B15 - Simple demo - buttons config ADVANCED strategy (close, download and exturl)</h3>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [buttonsConfig]=\"buttonsConfigAdvanced\"></ks-modal-gallery>\n    </section>\n    <section>\n      <h3>B16 - Simple demo - buttons config FULL strategy (all buttons)</h3>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [buttonsConfig]=\"buttonsConfigFull\"></ks-modal-gallery>\n    </section>\n    <section>\n      <h3>B17 - Simple demo - buttons config CUSTOM strategy with font-awesome</h3>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [downloadable]=\"true\"\n                        [buttonsConfig]=\"customButtonsConfig\"></ks-modal-gallery>\n    </section>\n    <br>\n    <hr>\n    <br>\n    <h2>Advanced examples</h2>\n    <section>\n      <h3>C1 - Advanced demo - custom keyboard</h3>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [keyboardConfig]=\"{esc: 81, left: 40, right: 38}\"></ks-modal-gallery>\n    </section>\n    <section>\n      <h3>C2 - Advanced demo - custom description always visible</h3>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [description]=\"customDescription\"></ks-modal-gallery>\n    </section>\n    <section>\n      <h3>C3 - Advanced demo - custom description hide if empty</h3>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [description]=\"customDescriptionHideIfEmpty\"></ks-modal-gallery>\n    </section>\n    <section>\n      <h3>C4 - Advanced demo - custom description always hidden</h3>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [description]=\"customFullDescriptionHidden\"></ks-modal-gallery>\n    </section>\n    <section>\n      <h3>C5 - Advanced demo - custom FULL description always visible</h3>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [description]=\"customFullDescription\"></ks-modal-gallery>\n    </section>\n\n\n    <section>\n      <h3>C6 - Advanced demo - preview custom configuration with 1 image (clickable)</h3>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [previewConfig]=\"previewConfigFiveImages\"></ks-modal-gallery>\n    </section>\n    <section>\n      <h3>C7 - Advanced demo - preview custom configuration without arrows (clickable)</h3>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [previewConfig]=\"previewConfigNoArrows\"></ks-modal-gallery>\n    </section>\n    <section>\n      <h3>C8 - Advanced demo - preview custom configuration not clickable</h3>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [previewConfig]=\"previewConfigNoClickable\"></ks-modal-gallery>\n    </section>\n    <section>\n      <h3>C9 - Advanced demo - preview custom configuration always center <span style=\"color:red;\">STILL NOT IMPLEMENTED</span> </h3>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [previewConfig]=\"previewConfigAlwaysCenter\"></ks-modal-gallery>\n    </section>\n    <section>\n      <h3>C10 - Advanced demo - preview custom configuration with custom size</h3>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [previewConfig]=\"previewConfigCustomSize\"></ks-modal-gallery>\n    </section>\n\n\n    <section>\n      <h3>C11 - Advanced demo - accessibility config</h3>\n      <br>\n      <ks-modal-gallery [modalImages]=\"images\"\n                        [accessibilityConfig]=\"accessibilityConfig\"></ks-modal-gallery>\n    </section>\n\n\n    <br><br>\n    <h4>Created by Stefano Cappa (Ks89)</h4>\n\n  "
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map