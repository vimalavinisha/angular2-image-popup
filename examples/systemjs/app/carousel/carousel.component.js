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
Object.defineProperty(exports, '__esModule', { value: true });
var core_1 = require('@angular/core');
var angular_modal_gallery_1 = require('@ks89/angular-modal-gallery');
var CarouselComponent = /** @class */ (function() {
  function CarouselComponent() {
    this.imageIndex = 1;
    this.galleryId = 1;
    this.autoPlay = true;
    this.showArrows = true;
    this.showDots = true;
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
  CarouselComponent.prototype.addRandomImage = function() {
    var imageToCopy = this.imagesRect[Math.floor(Math.random() * this.imagesRect.length)];
    var newImage = new angular_modal_gallery_1.Image(this.imagesRect.length - 1 + 1, imageToCopy.modal, imageToCopy.plain);
    this.imagesRect = this.imagesRect.concat([newImage]);
  };
  CarouselComponent.prototype.onChangeAutoPlay = function() {
    this.autoPlay = !this.autoPlay;
  };
  CarouselComponent.prototype.onChangeShowArrows = function() {
    this.showArrows = !this.showArrows;
  };
  CarouselComponent.prototype.onChangeShowDots = function() {
    this.showDots = !this.showDots;
  };
  CarouselComponent = __decorate(
    [
      core_1.Component({
        selector: 'ks-carousel-page',
        templateUrl: './carousel.component.html',
        styleUrls: ['./carousel.component.css']
      })
    ],
    CarouselComponent
  );
  return CarouselComponent;
})();
exports.CarouselComponent = CarouselComponent;
//# sourceMappingURL=carousel.component.js.map
