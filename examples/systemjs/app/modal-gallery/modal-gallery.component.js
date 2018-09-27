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
var ModalGalleryComponent = /** @class */ (function() {
  function ModalGalleryComponent(galleryService, sanitizer) {
    this.galleryService = galleryService;
    this.sanitizer = sanitizer;
    this.imageIndex = 1;
    this.galleryId = 1;
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
    // example of a png converted into base64 using https://www.base64-image.de/ or other similar websites
    this.base64String =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABN0lEQV' +
      'R4nO3SQQ2AQBDAwAVlaMEhCkAV' +
      'b2RcQmcU9NEZAAAAAOD/tvN675k5VoewxLOvLmAtA8QZIM4AcQaIM0CcAeIMEGeAOAPEGSDOAHEGiDNAnAHiDBBngDgDxBkgzgBxBogzQJwB4gwQZ4A4A8QZIM4AcQaIM0C' +
      'cAeIMEGeAOAPEGSDOAHEGiDNAnAHiDBBngDgDxBkgzgBxBogzQJwB4gwQZ4A4A8QZIM4AcQaIM0CcAeIMEGeAOAPEGSDOAHEGiDNAnAHiDBBngDgDxBkgzgBxBogzQJwB4g' +
      'wQZ4A4A8QZIM4AcQaIM0CcAeIMEGeAOAPEGSDOAHEGiDNAnAHiDBBngDgDxBkgzgBxBogzQJwB4gwQZ4A4A8QZIM4AcQaIM0CcAeIMEGeAOAPEGQAAAAAA4Pc+8asEoPPGq' +
      'xUAAAAASUVORK5CYII';
    this.base64RedString =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAY1BMVEX/AAD/////WVn/+vr/qan/Nzf/ERH/2tr/s7P/KSn/' +
      '7+//vr7/0ND/W1v/6+v/m5v/4+P/U1P/HR3/o6P/rq7/g4P/k5P/t7f/dXX/SEj/zMz/ZWX/h4f/bm7/amr/np7/yMhDG/2oAAAC8ElEQVR4nO3dC3KqQBCF4WkHERHFRyKIL/' +
      'a/ymDuVYMMFipTbbfnW8H5S4lQVGUMaWe4B3iHQvlQKB8K5UOhfCiUD4XyoVA+FJ7Myijd5dvBO9nmuzQqZ68X2mI9NO9suC7s84VxNuAO6GSQxU8VJvuQe3pn4T55uLDYcK9+' +
      '0KZ4qDB574vPbej+HF2Fcc499km563p0FAbcQ18QdCi0B+6VLzk0fjtuC0dj7o0vGo/uF064B/agvFcYca/rRdReeOTe1pNjW6HkP6J1gbtQwzV4NnEVJtyrepU0C2M599ldhH' +
      'GjcMq9qWfT28KUe1Hv0nrhnHuPB/Na4YJ7jgeLv4UZ9xovsmuhXXKP8WJpL4Ur7i2erC6Fun4Kr8Jz4Rf3Em++/hdKf+htN/5XqOuGtC75LfzmnuHR96nQ6v2SVl9TWxVq/pKevq' +
      'aG1twjvFpXhTLeLz1rQMZyb/DMmhH3BM9GRudjxVVmtN51n62M1DdpXeVG2rveR22MxLe9jxgazfdsJ2Oj9en3THsfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
      'AAAAAAAAAAAAAAgHba/+98+AFnI+g/30L/GSX6z5nRf1aQ/vOe9J/Zpf/cNf1n533A+Yf6z7DUfw6p/rNkVX9Nkw850/kDzuXWf7Y6ab37Xl0K7ZJ7ixdLeykknQ8YGV0LacG9xo' +
      'MF/S2cc8/xYF4rpJR7T+9SqhfSlHtRz6Z0Wxjr+lEM40ahstvThJqFNOFe1aMJuQop4N7Vm4DchXTkXtaTI7UVUsS9rRcRtRequBZLuldII+mPw+MR3S8ke+De+JKDvQ1qFMr+kx' +
      'o0cxyFFEt945bHjhpXYXV/I/HN8DBxtrgLiQpp74Y3RUtJW2H1Oe7l3IuHe/fnd7+wuh4zGe+lBpnr+utSWLHF+r0vyeG6aPw+PFT4a1ZG6S7fDt7JNt+lUTnrsL5LoWwolA+F8q' +
      'FQPhTKh0L5UCgfCuVDoXw/lnQz7dm7GjoAAAAASUVORK5CYII=';
    this.base64GreenString =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIAgMAAADQNkYNAAAADFBMVEUAAAAy/ysy/ysy/ysyTcibAAAAA3RSTlMA2r/af0d' +
      'WAAAAQUlEQVRo3u3YMREAMAzEsJAMyZJsMXy3XORdBFySJK3qxFXH1Y1DEARBEARBEARBEARBEARBkNmk436mvSRJ0o4eOKL2P81eyn8AAAAASUVORK5CYII=';
    this.base64Image = this.sanitizer.bypassSecurityTrustResourceUrl(this.base64String);
    this.base64RedImage = this.sanitizer.bypassSecurityTrustResourceUrl(this.base64RedString);
    this.base64GreenImage = this.sanitizer.bypassSecurityTrustResourceUrl(this.base64GreenString);
    this.imagesBase64 = [
      new angular_modal_gallery_1.Image(0, {
        img: this.base64Image,
        extUrl: 'http://www.google.com'
      }),
      new angular_modal_gallery_1.Image(1, {
        img: this.base64GreenImage,
        description: 'Description 2'
      }),
      new angular_modal_gallery_1.Image(
        2,
        {
          img: this.base64RedImage,
          description: 'Description 3',
          extUrl: 'http://www.google.com'
        },
        {
          img: this.base64RedImage,
          title: 'custom title 2',
          alt: 'custom alt 2',
          ariaLabel: 'arial label 2'
        }
      )
    ];
    this.imagesCustomDownloadFileName = [
      new angular_modal_gallery_1.Image(0, {
        img: '../assets/images/gallery/img1.jpg',
        downloadFileName: 'first-img.jpg'
      }),
      new angular_modal_gallery_1.Image(1, {
        img: this.base64Image,
        downloadFileName: 'second-img-base64.jpg'
      })
    ];
    this.imagesHtmlDescriptions = [
      new angular_modal_gallery_1.Image(0, {
        img: '../assets/images/gallery/img1.jpg',
        extUrl: 'http://www.google.com'
      }),
      new angular_modal_gallery_1.Image(1, {
        img: '../assets/images/gallery/img2.jpg',
        description: '<ol><li>This is</li><li>the description</li><li>number</li><li>2</li></ol>'
      }),
      new angular_modal_gallery_1.Image(
        2,
        {
          img: '../assets/images/gallery/img3.jpg',
          description: '<ul><li>Description</li><li><i>3</i></li></ul>',
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
    this.imagesMixedSizes = [
      new angular_modal_gallery_1.Image(0, {
        img: '../assets/images/gallery/pexels-photo-135230.png',
        description: 'Description 1'
      }),
      new angular_modal_gallery_1.Image(1, {
        img: '../assets/images/gallery/pexels-photo-547115.jpeg'
      }),
      new angular_modal_gallery_1.Image(2, {
        img: '../assets/images/gallery/pexels-photo-556664.jpeg',
        description: 'Description 3'
      }),
      new angular_modal_gallery_1.Image(3, {
        img: '../assets/images/gallery/pexels-photo-787594.jpeg',
        description: 'Description 4'
      }),
      new angular_modal_gallery_1.Image(4, {
        img: '../assets/images/gallery/pexels-photo-803105.jpeg'
      })
    ];
    // example of images with small previews (they are different files) to show
    // loading spinners
    this.imagesForLoadingSpinner = [
      new angular_modal_gallery_1.Image(
        0,
        {
          img: '../assets/images/loading-spinner-samples/pexels-photo-74506.jpg'
        },
        { img: '../assets/images/loading-spinner-samples/pexels-photo-74506-thumb.jpg' }
      ),
      new angular_modal_gallery_1.Image(
        1,
        {
          img: '../assets/images/loading-spinner-samples/pexels-photo-106006.jpg'
        },
        { img: '../assets/images/loading-spinner-samples/pexels-photo-106006-thumb.jpg' }
      ),
      new angular_modal_gallery_1.Image(
        2,
        {
          img: '../assets/images/loading-spinner-samples/pexels-photo-464336.jpg'
        },
        { img: '../assets/images/loading-spinner-samples/pexels-photo-464336-thumb.jpg' }
      ),
      new angular_modal_gallery_1.Image(
        3,
        {
          img: '../assets/images/loading-spinner-samples/pexels-photo.jpg'
        },
        { img: '../assets/images/loading-spinner-samples/pexels-photo-thumb.jpg' }
      ),
      new angular_modal_gallery_1.Image(
        4,
        {
          img: '../assets/images/loading-spinner-samples/traffic-highway-lights-night-56891.jpg'
        },
        { img: '../assets/images/loading-spinner-samples/traffic-highway-lights-night-56891-thumb.jpg' }
      )
    ];
    this.imagesRotated = [
      new angular_modal_gallery_1.Image(0, {
        img: '../assets/images/gallery/pexels-photo-135230.png',
        description: 'Description 1',
        angle: 180
      }),
      new angular_modal_gallery_1.Image(1, {
        img: '../assets/images/gallery/pexels-photo-547115.jpeg',
        angle: 90
      }),
      new angular_modal_gallery_1.Image(2, {
        img: '../assets/images/gallery/pexels-photo-556664.jpeg',
        description: 'Description 3',
        angle: 270
      }),
      new angular_modal_gallery_1.Image(3, {
        img: '../assets/images/gallery/pexels-photo-787594.jpeg',
        description: 'Description 4',
        angle: 0
      }),
      new angular_modal_gallery_1.Image(4, {
        img: '../assets/images/gallery/pexels-photo-803105.jpeg',
        angle: 90
      })
    ];
    // array with a single image inside (the first one)
    this.singleImage = [this.images[0]];
    this.imagesInfiniteAutoAdd = [this.images[0]];
    this.dotsConfig = {
      visible: false
    };
    this.customDescription = {
      strategy: angular_modal_gallery_1.DescriptionStrategy.ALWAYS_VISIBLE,
      imageText: 'Look this image ',
      numberSeparator: ' of ',
      beforeTextDescription: ' => '
    };
    this.customDescriptionStyle = {
      strategy: angular_modal_gallery_1.DescriptionStrategy.ALWAYS_VISIBLE,
      imageText: 'Look this image ',
      numberSeparator: ' of ',
      beforeTextDescription: ' => ',
      style: {
        bgColor: 'rgba(255,0,0,.5)',
        textColor: 'blue',
        marginTop: '3px',
        marginBottom: '0px',
        marginLeft: '5px',
        marginRight: '5px',
        position: 'absolute',
        top: '0px',
        height: '25px'
        // be careful to use width, in particular with % values
      }
    };
    this.customDescriptionHideIfEmpty = {
      strategy: angular_modal_gallery_1.DescriptionStrategy.HIDE_IF_EMPTY,
      imageText: 'Look this image ',
      numberSeparator: ' of ',
      beforeTextDescription: ' => '
    };
    this.customFullDescription = {
      strategy: angular_modal_gallery_1.DescriptionStrategy.ALWAYS_VISIBLE,
      // you should build this value programmaticaly with the result of (show)="..()" event
      customFullDescription: 'Custom description of the current visible image'
      // if customFullDescription !== undefined, all other fields will be ignored
      // imageText: '',
      // numberSeparator: '',
      // beforeTextDescription: '',
    };
    this.customFullDescriptionHidden = {
      strategy: angular_modal_gallery_1.DescriptionStrategy.ALWAYS_HIDDEN,
      // you should build this value programmaticaly with the result of (show)="..()" event
      customFullDescription: 'Custom description of the current visible image'
      // if customFullDescription !== undefined, all other fields will be ignored
      // imageText: '',
      // numberSeparator: '',
      // beforeTextDescription: '',
    };
    // customButtonsSize: ButtonSize = {
    //   width: 10,
    //   height: 10,
    //   unit: 'px'
    // };
    this.buttonsConfigDefault = {
      visible: true,
      strategy: angular_modal_gallery_1.ButtonsStrategy.DEFAULT
    };
    this.buttonsConfigSimple = {
      visible: true,
      strategy: angular_modal_gallery_1.ButtonsStrategy.SIMPLE
    };
    this.buttonsConfigAdvanced = {
      visible: true,
      strategy: angular_modal_gallery_1.ButtonsStrategy.ADVANCED
    };
    this.buttonsConfigFull = {
      visible: true,
      strategy: angular_modal_gallery_1.ButtonsStrategy.FULL
    };
    this.buttonsConfigCustom = {
      visible: true,
      strategy: angular_modal_gallery_1.ButtonsStrategy.CUSTOM,
      buttons: [
        angular_modal_gallery_1.KS_DEFAULT_BTN_ROTATE,
        angular_modal_gallery_1.KS_DEFAULT_BTN_FULL_SCREEN,
        angular_modal_gallery_1.KS_DEFAULT_BTN_DELETE,
        angular_modal_gallery_1.KS_DEFAULT_BTN_EXTURL,
        angular_modal_gallery_1.KS_DEFAULT_BTN_DOWNLOAD,
        angular_modal_gallery_1.KS_DEFAULT_BTN_CLOSE
      ]
    };
    // default buttons but extUrl will open the link in a new tab instead of the current one
    // this requires to specify all buttons manually (also if they are not really custom)
    this.customButtonsConfigExtUrlNewTab = {
      visible: true,
      strategy: angular_modal_gallery_1.ButtonsStrategy.CUSTOM,
      buttons: [
        {
          className: 'ext-url-image',
          type: angular_modal_gallery_1.ButtonType.EXTURL,
          extUrlInNewTab: true // <--- this is the important thing to understand this example
        },
        {
          className: 'download-image',
          type: angular_modal_gallery_1.ButtonType.DOWNLOAD
        },
        {
          className: 'close-image',
          type: angular_modal_gallery_1.ButtonType.CLOSE
        }
      ]
    };
    this.customButtonsFontAwesomeConfig = {
      visible: true,
      strategy: angular_modal_gallery_1.ButtonsStrategy.CUSTOM,
      buttons: [
        {
          className: 'fas fa-plus white',
          type: angular_modal_gallery_1.ButtonType.CUSTOM,
          ariaLabel: 'custom plus aria label',
          title: 'custom plus title',
          fontSize: '20px'
        },
        {
          className: 'fas fa-times white',
          type: angular_modal_gallery_1.ButtonType.CLOSE,
          ariaLabel: 'custom close aria label',
          title: 'custom close title',
          fontSize: '20px'
        },
        {
          className: 'fas fa-download white',
          type: angular_modal_gallery_1.ButtonType.DOWNLOAD,
          ariaLabel: 'custom download aria label',
          title: 'custom download title',
          fontSize: '20px'
        },
        {
          className: 'fas fa-external-link-alt white',
          type: angular_modal_gallery_1.ButtonType.EXTURL,
          ariaLabel: 'custom exturl aria label',
          title: 'custom exturl title',
          fontSize: '20px'
        }
      ]
    };
    this.previewConfigOneImage = {
      visible: true,
      number: 1
    };
    this.previewConfigFiveImages = {
      visible: true,
      number: 5
    };
    this.previewConfigNoArrows = {
      visible: true,
      arrows: false
    };
    this.previewConfigNoClickable = {
      visible: true,
      clickable: false
    };
    // TODO still not implemented
    this.previewConfigAlwaysCenter = {
      visible: true
    };
    this.previewConfigCustomSize = {
      visible: true,
      size: { width: '30px', height: '30px' }
    };
    this.currentImageConfigExperimental = {
      loadingConfig: { enable: true, type: angular_modal_gallery_1.LoadingType.STANDARD },
      description: { strategy: angular_modal_gallery_1.DescriptionStrategy.ALWAYS_VISIBLE }
    };
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
    this.count = 0;
    // this variable is used only for example of auto navigation
    this.isShownAutoNavigate = false;
  }
  ModalGalleryComponent.prototype.onButtonBeforeHook = function(event) {
    console.log('onButtonBeforeHook ', event);
    if (!event || !event.button) {
      return;
    }
    // Invoked after a click on a button, but before that the related
    // action is applied.
    // For instance: this method will be invoked after a click
    // of 'close' button, but before that the modal gallery
    // will be really closed.
    if (event.button.type === angular_modal_gallery_1.ButtonType.DELETE) {
      // remove the current image and reassign all other to the array of images
      console.log('delete in app with images count ' + this.images.length);
      this.images = this.images.filter(function(val) {
        return event.image && val.id !== event.image.id;
      });
    }
  };
  ModalGalleryComponent.prototype.onButtonAfterHook = function(event) {
    console.log('onButtonAfterHook ', event);
    if (!event || !event.button) {
      return;
    }
    // Invoked after both a click on a button and its related action.
    // For instance: this method will be invoked after a click
    // of 'close' button, but before that the modal gallery
    // will be really closed.
  };
  ModalGalleryComponent.prototype.onCustomButtonBeforeHook = function(event, galleryId) {
    var _this = this;
    console.log('onCustomButtonBeforeHook with galleryId=' + galleryId + ' and event: ', event);
    if (!event || !event.button) {
      return;
    }
    // Invoked after a click on a button, but before that the related
    // action is applied.
    if (event.button.type === angular_modal_gallery_1.ButtonType.CUSTOM) {
      console.log('adding a new random image at the end');
      this.addRandomImage();
      setTimeout(function() {
        _this.galleryService.openGallery(galleryId, _this.images.length - 1);
      }, 0);
    }
  };
  ModalGalleryComponent.prototype.onCustomButtonAfterHook = function(event, galleryId) {
    console.log('onCustomButtonAfterHook with galleryId=' + galleryId + ' and event: ', event);
    if (!event || !event.button) {
      return;
    }
    // Invoked after both a click on a button and its related action.
  };
  ModalGalleryComponent.prototype.onImageLoaded = function(event) {
    // angular-modal-gallery will emit this event if it will load successfully input images
    console.log('onImageLoaded action: ' + angular_modal_gallery_1.Action[event.action]);
    console.log('onImageLoaded result:' + event.result);
  };
  ModalGalleryComponent.prototype.onVisibleIndex = function(event) {
    console.log('onVisibleIndex action: ' + angular_modal_gallery_1.Action[event.action]);
    console.log('onVisibleIndex result:' + event.result);
  };
  ModalGalleryComponent.prototype.onIsFirstImage = function(event) {
    console.log('onIsFirstImage onfirst action: ' + angular_modal_gallery_1.Action[event.action]);
    console.log('onIsFirstImage onfirst result:' + event.result);
  };
  ModalGalleryComponent.prototype.onIsLastImage = function(event) {
    console.log('onIsLastImage onlast action: ' + angular_modal_gallery_1.Action[event.action]);
    console.log('onIsLastImage onlast result:' + event.result);
  };
  ModalGalleryComponent.prototype.onCloseImageModal = function(event) {
    console.log('onClose action: ' + angular_modal_gallery_1.Action[event.action]);
    console.log('onClose result:' + event.result);
  };
  ModalGalleryComponent.prototype.onShowAutoCloseExample = function(event, galleryId) {
    var _this = this;
    console.log('onShowAutoCloseExample with id=' + galleryId + ' action: ' + angular_modal_gallery_1.Action[event.action]);
    console.log('onShowAutoCloseExample result:' + event.result);
    console.log('Starting timeout of 3 second to close modal gallery automatically');
    setTimeout(function() {
      console.log('setTimeout end - closing gallery with id=' + galleryId);
      _this.galleryService.closeGallery(galleryId);
    }, 3000);
  };
  ModalGalleryComponent.prototype.onShowAutoNavigateExample = function(event, galleryId) {
    var _this = this;
    if (this.isShownAutoNavigate) {
      // this prevent multiple triggers of this method
      // this is only an example and shouldn't be done in this way in a real app
      return;
    }
    console.log('onShowAutoNavigateExample with id=' + galleryId + ' action: ' + angular_modal_gallery_1.Action[event.action]);
    console.log('onShowAutoNavigateExample result:' + event.result);
    console.log('Starting timeout of 3 second to navigate to image 0 and then to the next every second automatically');
    setTimeout(function() {
      _this.isShownAutoNavigate = true;
      console.log('setTimeout end - navigating to index 0, gallery with id=' + galleryId);
      _this.galleryService.navigateGallery(galleryId, 0);
      setTimeout(function() {
        console.log('setTimeout end - navigating to index 1, gallery with id=' + galleryId);
        _this.galleryService.navigateGallery(galleryId, 1);
        setTimeout(function() {
          console.log('setTimeout end - navigating to index 2 (finished :) !), gallery with id=' + galleryId);
          _this.galleryService.navigateGallery(galleryId, 2);
        }, 3000);
      }, 3000);
    }, 3000);
  };
  ModalGalleryComponent.prototype.addRandomImage = function() {
    var imageToCopy = this.images[Math.floor(Math.random() * this.images.length)];
    var newImage = new angular_modal_gallery_1.Image(this.images.length - 1 + 1, imageToCopy.modal, imageToCopy.plain);
    this.images = this.images.concat([newImage]);
  };
  ModalGalleryComponent.prototype.openModalViaService = function(id, index) {
    console.log('opening gallery with index ' + index);
    this.galleryService.openGallery(id, index);
  };
  ModalGalleryComponent.prototype.autoAddImage = function() {
    var _this = this;
    if (this.count !== 0) {
      return;
    }
    var interval = setInterval(function() {
      var imageToCopy = _this.images[Math.floor(Math.random() * _this.images.length)];
      var newImage = new angular_modal_gallery_1.Image(_this.imagesInfiniteAutoAdd.length - 1 + 1, imageToCopy.modal, imageToCopy.plain);
      _this.imagesInfiniteAutoAdd = _this.imagesInfiniteAutoAdd.concat([newImage]);
      _this.count++;
      if (_this.count === 4) {
        clearInterval(interval);
      }
    }, 2000);
  };
  ModalGalleryComponent.prototype.trackById = function(index, item) {
    return item.id;
  };
  ModalGalleryComponent = __decorate(
    [
      core_1.Component({
        selector: 'ks-modal-gallery-page',
        templateUrl: './modal-gallery.component.html',
        styleUrls: ['./modal-gallery.component.css']
      }),
      __metadata('design:paramtypes', [angular_modal_gallery_1.GalleryService, platform_browser_1.DomSanitizer])
    ],
    ModalGalleryComponent
  );
  return ModalGalleryComponent;
})();
exports.ModalGalleryComponent = ModalGalleryComponent;
//# sourceMappingURL=modal-gallery.component.js.map
