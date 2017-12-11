/*
 The MIT License (MIT)

 Copyright (c) 2017 Stefano Cappa (Ks89)

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

import { Component } from '@angular/core';

import {
  AccessibilityConfig,
  Action,
  ButtonEvent,
  ButtonsConfig,
  ButtonsStrategy,
  ButtonType,
  Description,
  DescriptionStrategy,
  DotsConfig,
  Image,
  ImageModalEvent,
  PreviewConfig,
  PlainGalleryConfig,
  LineLayout,
  PlainGalleryStrategy,
  GridLayout
} from 'angular-modal-gallery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  openModalWindow = false;
  imagePointer = 0;

  plainGalleryRow: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.ROW,
    layout:  new LineLayout({length: 2, iconClass: '', wrap: true}, false, 'flex-start'),
    size: {
      width: '50px',
      height: '50px'
    }
  };
  plainGalleryRowReverse: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.ROW,
    layout:  new LineLayout({length: 2, iconClass: '', wrap: true}, true, 'flex-start'),
    size: {
      width: '50px',
      height: '50px'
    }
  };

  plainGalleryColumn: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.COLUMN,
    layout:  new LineLayout({length: 3, iconClass: '', wrap: true}, false, 'flex-start'),
    size: {
      width: '50px',
      height: '50px'
    }
  };
  plainGalleryColumnReverse: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.COLUMN,
    layout:  new LineLayout({length: 3, iconClass: '', wrap: true}, true, 'flex-start'),
    size: {
      width: '50px',
      height: '50px'
    }
  };

  plainGalleryGrid: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.GRID,
    layout:  new GridLayout({length: 3, iconClass: '', wrap: true}),
    size: {
      width: '50px',
      height: '50px'
    }
  };

  images: Image[] = [
    new Image(
      0,
      '../assets/images/gallery/img1.jpg',
      null, // no thumb
      null, // no description
      'http://www.google.com'
    ),
    new Image(
      1,
      '../assets/images/gallery/img2.png', // example with a PNG image
      null, // no thumb
      'Description 2',
      null // url
    ),
    new Image(
      2,
      '../assets/images/gallery/img3.jpg',
      '../assets/images/gallery/thumbs/img3.png', // example with a PNG thumb image
      'Description 3',
      'http://www.google.com'
    ),
    new Image(
      3,
      '../assets/images/gallery/img4.jpg',
      null, // no thumb
      'Description 4',
      'http://www.google.com'
    ),
    new Image(
      4,
      '../assets/images/gallery/img5.jpg',
      '../assets/images/gallery/thumbs/img5.jpg',
      null, // no description
      null // url
    )
  ];

  imagesRect: Image[] = [
    new Image(
      0,
      '../assets/images/gallery/milan-pegasus-gallery-statue.jpg',
      '../assets/images/gallery/thumbs/t-milan-pegasus-gallery-statue.jpg',
      null, null
    ),
    new Image(
      1,
      '../assets/images/gallery/pexels-photo-47223.jpeg',
      '../assets/images/gallery/thumbs/t-pexels-photo-47223.jpg',
      null, null
    ),
    new Image(
      2,
      '../assets/images/gallery/pexels-photo-52062.jpeg',
      '../assets/images/gallery/thumbs/t-pexels-photo-52062.jpg',
      null, null
    ),
    new Image(
      3,
      '../assets/images/gallery/pexels-photo-66943.jpeg',
      '../assets/images/gallery/thumbs/t-pexels-photo-66943.jpg',
      null, null
    ),
    new Image(
      4,
      '../assets/images/gallery/pexels-photo-93750.jpeg',
      '../assets/images/gallery/thumbs/t-pexels-photo-93750.jpg',
      null, null
    ),
    new Image(
      5,
      '../assets/images/gallery/pexels-photo-94420.jpeg',
      '../assets/images/gallery/thumbs/t-pexels-photo-94420.jpg',
      null, null
    ),
    new Image(
      6,
      '../assets/images/gallery/pexels-photo-96947.jpeg',
      '../assets/images/gallery/thumbs/t-pexels-photo-96947.jpg',
      null, null
    )
  ];

  // array with a single image inside (the first one)
  singleImage: Image[] = [this.images[0]];

  dotsConfig: DotsConfig = {
    visible: false
  };

  previewConfig: PreviewConfig = {
    visible: false,
    number: 3,
    arrows: true,
    clickable: true,
    alwaysCenter: false,
    size: {
      width: '70px',
      height: '70px'
    }
  };

  customDescription: Description = {
    strategy: DescriptionStrategy.ALWAYS_VISIBLE,
    imageText: 'Look this image ',
    numberSeparator: ' of ',
    beforeTextDescription: ' => '
  };

  customDescriptionHideIfEmpty: Description = {
    strategy: DescriptionStrategy.HIDE_IF_EMPTY,
    imageText: 'Look this image ',
    numberSeparator: ' of ',
    beforeTextDescription: ' => '
  };

  customFullDescription: Description = {
    strategy: DescriptionStrategy.ALWAYS_VISIBLE,
    // you should build this value programmaticaly with the result of (show)="..()" event
    customFullDescription: 'Custom description of the current visible image'
    // if customFullDescription !== undefined, all other fields will be ignored
    // imageText: '',
    // numberSeparator: '',
    // beforeTextDescription: '',
  };

  customFullDescriptionHidden: Description = {
    strategy: DescriptionStrategy.ALWAYS_HIDDEN,
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

  buttonsConfigDefault: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.DEFAULT
  };
  buttonsConfigSimple: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.SIMPLE
  };
  buttonsConfigAdvanced: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.ADVANCED
  };
  buttonsConfigFull: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.FULL
  };

  customButtonsConfig: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [
      {
        className: 'fa fa-plus white',
        type: ButtonType.CUSTOM,
        ariaLabel: 'custom plus aria label',
        title: 'custom plus title',
        fontSize: '20px'
      },
      {
        className: 'fa fa-close white',
        type: ButtonType.CLOSE,
        ariaLabel: 'custom close aria label',
        title: 'custom close title',
        fontSize: '20px'
      },
      {
        className: 'fa fa-refresh white',
        type: ButtonType.REFRESH,
        ariaLabel: 'custom refresh aria label',
        title: 'custom refresh title',
        fontSize: '20px'
      },
      {
        className: 'fa fa-download white',
        type: ButtonType.DOWNLOAD,
        ariaLabel: 'custom download aria label',
        title: 'custom download title',
        fontSize: '20px'
      },
      {
        className: 'fa fa-external-link white',
        type: ButtonType.EXTURL,
        ariaLabel: 'custom exturl aria label',
        title: 'custom exturl title',
        fontSize: '20px'
      }
    ]
  };


  previewConfigFiveImages: PreviewConfig = {
    visible: true,
    number: 1
  };

  previewConfigNoArrows: PreviewConfig = {
    visible: true,
    arrows: false
  };

  previewConfigNoClickable: PreviewConfig = {
    visible: true,
    clickable: false
  };

  previewConfigAlwaysCenter: PreviewConfig = {
    visible: true,
    alwaysCenter: true
  };

  previewConfigCustomSize: PreviewConfig = {
    visible: true,
    size: {width: '30px', height: '30px'}
  };


  accessibilityConfig: AccessibilityConfig = {
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

  openImageModal(image: Image) {
    this.imagePointer = this.images.indexOf(image);
    this.openModalWindow = true;
  }

  onButtonBeforeHook(event: ButtonEvent) {
    console.log('onButtonBeforeHook ', event);

    if (!event || !event.button) {
      return;
    }

    // Invoked after a click on a button, but before that the related
    // action is applied.
    // For instance: this method will be invoked after a click
    // of 'close' button, but before that the modal gallery
    // will be really closed.

    if (event.button.type === ButtonType.DELETE) {
      // remove the current image and reassign all other to the array of images

      console.log('delete in app with images count ' + this.images.length);

      this.images = this.images.filter((val: Image) => event.image && val.id !== event.image.id);

    }
  }

  onButtonAfterHook(event: ButtonEvent) {
    console.log('onButtonAfterHook ', event);

    if (!event || !event.button) {
      return;
    }

    // Invoked after both a click on a button and its related action.
    // For instance: this method will be invoked after a click
    // of 'close' button, but before that the modal gallery
    // will be really closed.
  }

  onImageLoaded(event: ImageModalEvent) {
    // angular-modal-gallery will emit this event if it will load successfully input images
    console.log('onImageLoaded action: ' + Action[event.action]);
    console.log('onImageLoaded result:' + event.result);
  }

  onVisibleIndex(event: ImageModalEvent) {
    this.customFullDescription.customFullDescription = `Custom description of visible image with index= ${event.result}`;
    console.log('action: ' + Action[event.action]);
    console.log('result:' + event.result);
  }

  onIsFirstImage(event: ImageModalEvent) {
    console.log('onfirst action: ' + Action[event.action]);
    console.log('onfirst result:' + event.result);
  }

  onIsLastImage(event: ImageModalEvent) {
    console.log('onlast action: ' + Action[event.action]);
    console.log('onlast result:' + event.result);
  }

  onCloseImageModal(event: ImageModalEvent) {
    console.log('onClose action: ' + Action[event.action]);
    console.log('onClose result:' + event.result);
    this.openModalWindow = false;
  }

  addRandomImage() {
    const newImage: Image = Object.assign({},
      this.images[Math.floor(Math.random() * this.images.length)],
      {id: this.images.length - 1 + 1});
    this.images = [...this.images, newImage];
  }

  trackById(index: number, item: Image) {
    return item.id;
  }
}
