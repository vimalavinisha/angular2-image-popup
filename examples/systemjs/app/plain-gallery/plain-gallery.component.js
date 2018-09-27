'use strict';
/*
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
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */
var __decorate =
  (this && this.__decorate) ||
  function(decorators, target, key, desc) {
    var c = arguments.length,
      r = c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function') r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function(k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function') return Reflect.metadata(k, v);
  };
Object.defineProperty(exports, '__esModule', { value: true });
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var angular_modal_gallery_1 = require('@ks89/angular-modal-gallery');
var PlainGalleryComponent = /** @class */ (function() {
  function PlainGalleryComponent(galleryService, sanitizer) {
    this.galleryService = galleryService;
    this.sanitizer = sanitizer;
    this.imageIndex = 1;
    this.galleryId = 200;
    this.customPlainGalleryRowConfig = {
      strategy: angular_modal_gallery_1.PlainGalleryStrategy.CUSTOM,
      layout: new angular_modal_gallery_1.AdvancedLayout(-1, true)
    };
    this.customPlainGalleryColumnConfig = {
      strategy: angular_modal_gallery_1.PlainGalleryStrategy.CUSTOM,
      layout: new angular_modal_gallery_1.AdvancedLayout(-1, true)
    };
    this.customPlainGalleryRowDescConfig = {
      strategy: angular_modal_gallery_1.PlainGalleryStrategy.CUSTOM,
      layout: new angular_modal_gallery_1.AdvancedLayout(-1, true)
    };
    this.plainGalleryRow = {
      strategy: angular_modal_gallery_1.PlainGalleryStrategy.ROW,
      layout: new angular_modal_gallery_1.LineLayout({ width: '80px', height: '80px' }, { length: 2, wrap: true }, 'flex-start')
    };
    this.plainGalleryRowSpaceAround = {
      strategy: angular_modal_gallery_1.PlainGalleryStrategy.ROW,
      layout: new angular_modal_gallery_1.LineLayout({ width: '50px', height: '50px' }, { length: 2, wrap: true }, 'space-around')
    };
    this.plainGalleryRowATags = {
      strategy: angular_modal_gallery_1.PlainGalleryStrategy.ROW,
      layout: new angular_modal_gallery_1.LineLayout({ width: '95px', height: '63px' }, { length: 4, wrap: true }, 'flex-start'),
      // when advanced is defined, additionalBackground: '50% 50%/cover' will be used by default.
      // I added this here, to be more explicit.
      advanced: { aTags: true, additionalBackground: '50% 50%/cover' }
    };
    this.plainGalleryColumn = {
      strategy: angular_modal_gallery_1.PlainGalleryStrategy.COLUMN,
      layout: new angular_modal_gallery_1.LineLayout({ width: '50px', height: '50px' }, { length: 3, wrap: true }, 'flex-start')
    };
    this.plainGalleryGrid = {
      strategy: angular_modal_gallery_1.PlainGalleryStrategy.GRID,
      layout: new angular_modal_gallery_1.GridLayout({ width: '80px', height: '80px' }, { length: 3, wrap: true })
    };
    this.images = [
      new angular_modal_gallery_1.Image(0, {
        img: '../assets/images/gallery/img1.jpg',
        extUrl: 'http://www.google.com'
      }),
      new angular_modal_gallery_1.Image(1, {
        img: '../assets/images/gallery/img2.jpg',
        description: 'Description 2'
      }),
      new angular_modal_gallery_1.Image(
        2,
        {
          img: '../assets/images/gallery/img3.jpg',
          description: 'Description 3',
          extUrl: 'http://www.google.com'
        },
        {
          img: '../assets/images/gallery/thumbs/img3.png',
          title: 'custom title 2',
          alt: 'custom alt 2',
          ariaLabel: 'arial label 2'
        }
      ),
      new angular_modal_gallery_1.Image(3, {
        img: '../assets/images/gallery/img4.jpg',
        description: 'Description 4',
        extUrl: 'http://www.google.com'
      }),
      new angular_modal_gallery_1.Image(4, { img: '../assets/images/gallery/img5.jpg' }, { img: '../assets/images/gallery/thumbs/img5.jpg' })
    ];
    this.imagesRect = [
      new angular_modal_gallery_1.Image(
        0,
        {
          img: '../assets/images/gallery/milan-pegasus-gallery-statue.jpg',
          description: 'Description 1'
        },
        { img: '../assets/images/gallery/thumbs/t-milan-pegasus-gallery-statue.jpg' }
      ),
      new angular_modal_gallery_1.Image(
        1,
        { img: '../assets/images/gallery/pexels-photo-47223.jpeg' },
        { img: '../assets/images/gallery/thumbs/t-pexels-photo-47223.jpg' }
      ),
      new angular_modal_gallery_1.Image(
        2,
        {
          img: '../assets/images/gallery/pexels-photo-52062.jpeg',
          description: 'Description 3'
        },
        {
          img: '../assets/images/gallery/thumbs/t-pexels-photo-52062.jpg',
          description: 'Description 3'
        }
      ),
      new angular_modal_gallery_1.Image(
        3,
        {
          img: '../assets/images/gallery/pexels-photo-66943.jpeg',
          description: 'Description 4'
        },
        { img: '../assets/images/gallery/thumbs/t-pexels-photo-66943.jpg' }
      ),
      new angular_modal_gallery_1.Image(
        4,
        { img: '../assets/images/gallery/pexels-photo-93750.jpeg' },
        { img: '../assets/images/gallery/thumbs/t-pexels-photo-93750.jpg' }
      ),
      new angular_modal_gallery_1.Image(
        5,
        {
          img: '../assets/images/gallery/pexels-photo-94420.jpeg',
          description: 'Description 6'
        },
        { img: '../assets/images/gallery/thumbs/t-pexels-photo-94420.jpg' }
      ),
      new angular_modal_gallery_1.Image(
        6,
        { img: '../assets/images/gallery/pexels-photo-96947.jpeg' },
        { img: '../assets/images/gallery/thumbs/t-pexels-photo-96947.jpg' }
      )
    ];
    this.accessibilityConfig = {
      backgroundAriaLabel: 'CUSTOM Modal gallery full screen background',
      backgroundTitle: 'CUSTOM background title',
      plainGalleryContentAriaLabel: 'CUSTOM Plain gallery content',
      plainGalleryContentTitle: 'CUSTOM plain gallery content title',
      modalGalleryContentAriaLabel: 'CUSTOM Modal gallery content',
      modalGalleryContentTitle: 'CUSTOM modal gallery content title',
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
      previewScrollNextTitle: 'CUSTOM Scroll next previews',
      carouselContainerAriaLabel: 'Current image and navigation',
      carouselContainerTitle: '',
      carouselPrevImageAriaLabel: 'Previous image',
      carouselPrevImageTitle: 'Previous image',
      carouselNextImageAriaLabel: 'Next image',
      carouselNextImageTitle: 'Next image',
      carouselDotsContainerAriaLabel: 'Image navigation dots',
      carouselDotsContainerTitle: '',
      carouselDotAriaLabel: 'Navigate to image number',
      carouselPreviewsContainerAriaLabel: 'Image previews',
      carouselPreviewsContainerTitle: '',
      carouselPreviewScrollPrevAriaLabel: 'Scroll previous previews',
      carouselPreviewScrollPrevTitle: 'Scroll previous previews',
      carouselPreviewScrollNextAriaLabel: 'Scroll next previews',
      carouselPreviewScrollNextTitle: 'Scroll next previews'
    };
  }
  PlainGalleryComponent.prototype.openImageModalRow = function(image) {
    console.log('Opening modal gallery from custom plain gallery row, with image: ', image);
    var index = this.getCurrentIndexCustomLayout(image, this.images);
    this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, {
      layout: new angular_modal_gallery_1.AdvancedLayout(index, true)
    });
  };
  PlainGalleryComponent.prototype.openImageModalColumn = function(image) {
    console.log('Opening modal gallery from custom plain gallery column, with image: ', image);
    var index = this.getCurrentIndexCustomLayout(image, this.images);
    this.customPlainGalleryColumnConfig = Object.assign({}, this.customPlainGalleryColumnConfig, {
      layout: new angular_modal_gallery_1.AdvancedLayout(index, true)
    });
  };
  PlainGalleryComponent.prototype.openImageModalRowDescription = function(image) {
    console.log('Opening modal gallery from custom plain gallery row and description, with image: ', image);
    var index = this.getCurrentIndexCustomLayout(image, this.imagesRect);
    this.customPlainGalleryRowDescConfig = Object.assign({}, this.customPlainGalleryRowDescConfig, {
      layout: new angular_modal_gallery_1.AdvancedLayout(index, true)
    });
  };
  PlainGalleryComponent.prototype.addRandomImage = function() {
    var imageToCopy = this.images[Math.floor(Math.random() * this.images.length)];
    var newImage = new angular_modal_gallery_1.Image(this.images.length - 1 + 1, imageToCopy.modal, imageToCopy.plain);
    this.images = this.images.concat([newImage]);
  };
  PlainGalleryComponent.prototype.openModalViaService = function(id, index) {
    console.log('opening gallery with index ' + index);
    this.galleryService.openGallery(id, index);
  };
  PlainGalleryComponent.prototype.trackById = function(index, item) {
    return item.id;
  };
  PlainGalleryComponent.prototype.getCurrentIndexCustomLayout = function(image, images) {
    return image ? images.indexOf(image) : -1;
  };
  PlainGalleryComponent = __decorate(
    [
      core_1.Component({
        selector: 'ks-plain-gallery-page',
        templateUrl: './plain-gallery.component.html',
        styleUrls: ['./plain-gallery.component.css']
      }),
      __metadata('design:paramtypes', [angular_modal_gallery_1.GalleryService, platform_browser_1.DomSanitizer])
    ],
    PlainGalleryComponent
  );
  return PlainGalleryComponent;
})();
exports.PlainGalleryComponent = PlainGalleryComponent;
//# sourceMappingURL=plain-gallery.component.js.map
