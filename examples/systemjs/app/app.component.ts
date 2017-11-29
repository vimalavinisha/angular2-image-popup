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


import { Component, OnInit, OnDestroy } from '@angular/core';

import { Image, Action, ImageModalEvent, Description } from 'angular-modal-gallery';

import { ButtonsConfig, ButtonsStrategy, ButtonType } from 'angular-modal-gallery';
import { DescriptionStrategy } from 'angular-modal-gallery';
import { PreviewConfig } from 'angular-modal-gallery';
import { DotsConfig } from 'angular-modal-gallery';
import { AccessibilityConfig } from 'angular-modal-gallery';
import { ButtonEvent } from 'angular-modal-gallery';

@Component({
  selector: 'my-app',
  styleUrls: ['./app/main.css'],
  template: `
    <h1>angular-modal-gallery official angular-cli demo</h1>
    <hr>
    <p>If you want, you can <b>add a random image</b> to every example
      <button (click)="addRandomImage()"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;Add image</button>
    </p>
    <br>
    <hr>

    <h2>Minimal examples</h2>
    <section>
      <h3>A1 - Minimal demo - all defaults</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"></ks-modal-gallery>
    </section>
    <section>
      <h3>A2 - Minimal demo - listen for events</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        (hasData)="onImageLoaded($event)"
                        (close)="onCloseImageModal($event)"
                        (show)="onVisibleIndex($event)"
                        (firstImage)="onIsFirstImage($event)"
                        (lastImage)="onIsLastImage($event)"
                        (buttonBeforeHook)="onButtonBeforeHook($event)"
                        (buttonAfterHook)="onButtonAfterHook($event)"></ks-modal-gallery>
    </section>
    <section>
      <h3>A3 - Minimal demo - single image</h3>
      <br>
      <ks-modal-gallery [modalImages]="singleImage"></ks-modal-gallery>
    </section>
    <br>
    <hr>
    <br>
    <h2>Simple examples</h2>
    <section>
      <h3>B1 - Simple demo - only current image and buttons (previews and dots are hidden)</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [previewConfig]="{visible: false}"
                        [dotsConfig]="{visible: false}"></ks-modal-gallery>
    </section>
    <section>
      <h3>B2 - Simple demo - only current image (buttons, previews and dots are hidden)</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [buttonsConfig]="{visible: false, strategy: 1}"
                        [previewConfig]="{visible: false}"
                        [dotsConfig]="{visible: false}"></ks-modal-gallery>
    </section>
    <section>
      <h3>B3 - Simple demo - only current image (side previews, buttons, previews and dots are hidden)</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [slideConfig]="{infinite: false, sidePreviews: {show: false}}"
                        [buttonsConfig]="{visible: false, strategy: 1}"
                        [previewConfig]="{visible: false}"
                        [dotsConfig]="{visible: false}"></ks-modal-gallery>
    </section>
    <section>
      <h3>B3bis - Simple demo - custom preview size</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [previewConfig]="{visible: true, size: {width: 90, height: 90, unit: 'px'}}"></ks-modal-gallery>
    </section>
    <section>
      <h3>B4 - Simple demo - disable closeOutside</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [enableCloseOutside]="false"></ks-modal-gallery>
    </section>
    <section>
      <h3>B5 - Simple demo - no downloadable at all</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [downloadable]="false"
                        [buttonsConfig]="{visible: true, strategy: 3}"></ks-modal-gallery>
    </section>
    <section>
      <h3>B6 - Simple demo - no download button (only with keyboard)</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [downloadable]="true"
                        [buttonsConfig]="{visible: true, strategy: 2}"></ks-modal-gallery>
    </section>
    <section>
      <h3>B7 - Simple demo - download with both button and keyboard</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [downloadable]="true"
                        [buttonsConfig]="{visible: true, strategy: 3}"></ks-modal-gallery>
    </section>
    <section>
      <h3>B8 - Simple demo - infinite sliding but NO previews</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [slideConfig]="{infinite: true, sidePreviews: {show: false}}"></ks-modal-gallery>
    </section>
    <section>
      <h3>B9 - Simple demo - infinite sliding and previews</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [slideConfig]="{infinite: true, sidePreviews: {show: true, width: 100, height: 100, unit: 'px'}}"></ks-modal-gallery>
    </section>
    <section>
      <h3>B10 - Simple demo - disable loading spinner</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [loadingConfig]="{enable: false, type: 1}"></ks-modal-gallery>
    </section>
    <section>
      <h3>B11 - Simple demo - loading spinner of type Standard</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [loadingConfig]="{enable: true, type: 1}"></ks-modal-gallery>
    </section>
    <section>
      <h3>B12 - Simple demo - loading spinner of type Circular</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [loadingConfig]="{enable: true, type: 2}"></ks-modal-gallery>
    </section>
    <section>
      <h3>B13 - Simple demo - loading spinner of type Bars</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [loadingConfig]="{enable: true, type: 3}"></ks-modal-gallery>
    </section>
    <section>
      <h3>B14 - Simple demo - loading spinner of type Dots</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [loadingConfig]="{enable: true, type: 4}"></ks-modal-gallery>
    </section>

    <section>
      <h3>B15 - Simple demo - buttons config DEFAULT strategy (only close)</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [buttonsConfig]="buttonsConfigDefault"></ks-modal-gallery>
    </section>
    <section>
      <h3>B16 - Simple demo - buttons config SIMPLE strategy (close and download)</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [buttonsConfig]="buttonsConfigSimple"></ks-modal-gallery>
    </section>
    <section>
      <h3>B17 - Simple demo - buttons config ADVANCED strategy (close, download and exturl)</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [buttonsConfig]="buttonsConfigAdvanced"></ks-modal-gallery>
    </section>
    <section>
      <h3>B18 - Simple demo - buttons config FULL strategy (all buttons)</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [buttonsConfig]="buttonsConfigFull"></ks-modal-gallery>
    </section>
    <section>
      <h3>B19 - Simple demo - buttons config CUSTOM strategy with font-awesome</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [downloadable]="true"
                        [buttonsConfig]="customButtonsConfig"></ks-modal-gallery>
    </section>
    <br>
    <hr>
    <br>
    <h2>Advanced examples</h2>
    <section>
      <h3>C1 - Advanced demo - custom keyboard</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [keyboardConfig]="{esc: 81, left: 40, right: 38}"></ks-modal-gallery>
    </section>
    <section>
      <h3>C2 - Advanced demo - custom description always visible</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [description]="customDescription"></ks-modal-gallery>
    </section>
    <section>
      <h3>C3 - Advanced demo - custom description hide if empty</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [description]="customDescriptionHideIfEmpty"></ks-modal-gallery>
    </section>
    <section>
      <h3>C4 - Advanced demo - custom description always hidden</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [description]="customFullDescriptionHidden"></ks-modal-gallery>
    </section>
    <section>
      <h3>C5 - Advanced demo - custom FULL description always visible</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [description]="customFullDescription"></ks-modal-gallery>
    </section>


    <section>
      <h3>C6 - Advanced demo - preview custom configuration with 1 image (clickable)</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [previewConfig]="previewConfigFiveImages"></ks-modal-gallery>
    </section>
    <section>
      <h3>C7 - Advanced demo - preview custom configuration without arrows (clickable)</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [previewConfig]="previewConfigNoArrows"></ks-modal-gallery>
    </section>
    <section>
      <h3>C8 - Advanced demo - preview custom configuration not clickable</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [previewConfig]="previewConfigNoClickable"></ks-modal-gallery>
    </section>
    <section>
      <h3>C9 - Advanced demo - preview custom configuration always center <span style="color:red;">STILL NOT IMPLEMENTED</span></h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [previewConfig]="previewConfigAlwaysCenter"></ks-modal-gallery>
    </section>
    <section>
      <h3>C10 - Advanced demo - preview custom configuration with custom size</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [previewConfig]="previewConfigCustomSize"></ks-modal-gallery>
    </section>


    <section>
      <h3>C11 - Advanced demo - accessibility config</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [accessibilityConfig]="accessibilityConfig"></ks-modal-gallery>
    </section>

    <section>
      <h3>C12 - Advanced demo - buttons config FULL strategy (all buttons) + listen for buttonBeforeHook and buttonAfterHook</h3>
      <br>
      <ks-modal-gallery [modalImages]="images"
                        [buttonsConfig]="buttonsConfigFull"
                        (buttonBeforeHook)="onButtonBeforeHook($event)"
                        (buttonAfterHook)="onButtonAfterHook($event)"></ks-modal-gallery>
    </section>

    <br><br>
    <h4>Created by Stefano Cappa (Ks89)</h4>

  `
})
export class AppComponent {

  openModalWindow = false;
  imagePointer = 0;

  images: Image[] = [
    new Image(
      0,
      './app/assets/images/gallery/img1.jpg',
      null, // no thumb
      null, // no description
      'http://www.google.com'
    ),
    new Image(
      1,
      './app/assets/images/gallery/img2.png', // example with a PNG image
      null, // no thumb
      'Description 2',
      null // url
    ),
    new Image(
      2,
      './app/assets/images/gallery/img3.jpg',
      './app/assets/images/gallery/thumbs/img3.png', // example with a PNG thumb image
      'Description 3',
      'http://www.google.com'
    ),
    new Image(
      3,
      './app/assets/images/gallery/img4.jpg',
      null, // no thumb
      'Description 4',
      'http://www.google.com'
    ),
    new Image(
      4,
      './app/assets/images/gallery/img5.jpg',
      './app/assets/images/gallery/thumbs/img5.jpg',
      null, // no description
      null // url
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
      width: 70,
      height: 70,
      unit: 'px'
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
    customFullDescription: 'Custom description of the current visible image',
    // if customFullDescription !== undefined, all other fields will be ignored
    // imageText: '',
    // numberSeparator: '',
    // beforeTextDescription: '',
  };

  customFullDescriptionHidden: Description = {
    strategy: DescriptionStrategy.ALWAYS_HIDDEN,
    // you should build this value programmaticaly with the result of (show)="..()" event
    customFullDescription: 'Custom description of the current visible image',
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
    size: {width: 30, height: 30, unit: 'px'}
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
    this.images.push(newImage);
  }

  trackById(index: number, item: Image) {
    return item.id;
  }
}
