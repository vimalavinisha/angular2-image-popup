/*
 The MIT License (MIT)

 Copyright (c) 2017 Stefano Cappa (Ks89)
 Copyright (c) 2016 vimalavinisha (only for version 1)

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
 FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

import { OnInit, Input, Output, EventEmitter, HostListener, Component, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { KeyboardService } from '../services/keyboard.service';

import { ButtonsConfig } from '../interfaces/buttons-config.interface';

/**
 * Enum `Action` with a list of possible actions.
 */
export enum Action {
  NORMAL, // default value
  CLICK, // mouse click
  KEYBOARD,
  SWIPE,
  LOAD
}

/**
 * Class `ImageModalEvent` that represents the Event after an action `action` and its result.
 */
export class ImageModalEvent {
  action: Action;
  result: number | boolean;

  constructor(action: Action, result: number | boolean) {
    this.action = action;
    this.result = result;
  }
}

/**
 * Class `Image` that represents an Image with both images and thumb paths,
 * also with a description and an external url.
 * The only required value is the image path `img`.
 */
export class Image {
  img: string;
  thumb?: string | null | undefined;
  description?: string | null | undefined;
  extUrl?: string | null | undefined;

  constructor(img: string, thumb?: string | null | undefined,
              description?: string | null | undefined, extUrl?: string | null | undefined) {
    this.img = img;
    this.thumb = thumb;
    this.description = description;
    this.extUrl = extUrl;
  }
}

/**
 * Enum `Keyboard` with keys and their relative key codes.
 */
export enum Keyboard {
  ESC = 27,
  LEFT_ARROW = 37,
  RIGHT_ARROW = 39,
  UP_ARROW = 38,
  DOWN_ARROW = 40
}

/**
 * Interface `Description` to change the description, either with a full custom
 * description or with a small and simple customization.
 */
export interface Description {
  customFullDescription?: string;
  imageText?: string;
  numberSeparator?: string;
  beforeTextDescription?: string;
}

// /**
//  * Interface `ButtonsConfig` to show/hide buttons.
//  */
// export interface ButtonsConfig {
//   download?: boolean;
//   extUrl?: boolean;
//   close?: boolean;
// }

/**
 * Interface `KeyboardConfig` to assign custom keyCodes to ESC, RIGHT and LEFT keyboard's actions.
 */
export interface KeyboardConfig {
  esc?: number;
  right?: number;
  left?: number;
}

/**
 * Interface `SlideConfig` to configure sliding features of modal gallery.
 */
export interface SlideConfig {
  infinite?: boolean;
}

/**
 * Main Component of this library with the modal gallery.
 */
@Component({
  selector: 'modal-gallery',
  exportAs: 'modalGallery',
  styleUrls: ['modal-gallery.scss'],
  templateUrl: 'modal-gallery.html'
})
export class AngularModalGalleryComponent implements OnInit, OnDestroy, OnChanges {
  /**
   * Array or Observable input that represents a list of Images used to show both
   * thumbs and the modal gallery.
   */
  @Input() modalImages: Observable<Array<Image>> | Array<Image>;
  /**
   * Number to open the modal gallery (passing a value >=0) showing the image with the
   * imagePointer's index.
   *
   * Be careful, because this feature will be probably deprecated/changed in version 4.0.0
   */
  @Input() imagePointer: number;
  /**
   * Boolean required to enable image download with both ctrl+s/cmd+s and download button.
   * If you want to show enable button, this is not enough. You have to use also `buttonsConfig`.
   */
  @Input() downloadable: boolean = false;
  /**
   * Description object with the configuration to show image descriptions.
   */
  @Input() description: Description;
  /**
   * Object of type `ButtonsConfig` to show/hide buttons.
   * This is used only inside `ngOnInit()` to create `configButtons`
   */
  @Input() buttonsConfig: ButtonsConfig;
  /**
   * Object of type `KeyboardConfig` to assign custom keys to ESC, RIGHT and LEFT keyboard's actions.
   */
  @Input() keyboardConfig: KeyboardConfig;
  /**
   * enableCloseOutside's input to enable modal-gallery close's behaviour while clicking
   * on the semi-transparent background. Enabled by default.
   */
  @Input() enableCloseOutside: boolean = true;
  /**
   * Object of type `SlideConfig` to configure sliding of modal gallery.
   * Disabled by default.
   */
  @Input() slideConfig: SlideConfig = { infinite: false };

  /**
   * DEPRECATED
   * -----REMOVE THIS IN 4.0.0----- deprecated both showDownloadButton and showExtUrlButton
   */
  @Input() showDownloadButton: boolean = false; // deprecated
  /**
   * DEPRECATED
   * -----REMOVE THIS IN 4.0.0----- deprecated both showDownloadButton and showExtUrlButton
   */
  @Input() showExtUrlButton: boolean = false; // deprecated

  @Output() close: EventEmitter<ImageModalEvent> = new EventEmitter<ImageModalEvent>();
  @Output() show: EventEmitter<ImageModalEvent> = new EventEmitter<ImageModalEvent>();
  @Output() firstImage: EventEmitter<ImageModalEvent> = new EventEmitter<ImageModalEvent>();
  @Output() lastImage: EventEmitter<ImageModalEvent> = new EventEmitter<ImageModalEvent>();
  @Output() hasData: EventEmitter<ImageModalEvent> = new EventEmitter<ImageModalEvent>();

  /**
   * Boolean that it is true if the modal gallery is visible
   */
  opened: boolean = false;
  /**
   * Boolean that it is true if an image of the modal gallery is still loading
   */
  loading: boolean = false;
  /**
   * Boolean to open the modal gallery. Closed by default.
   */
  showGallery: boolean = false;
  /**
   * Array of `Image` that represent the model of this library with all images, thumbs and so on.
   */
  images: Image[];
  /**
   * `Image` currently visible.
   */
  currentImage: Image;
  /**
   * Number that represents the index of the current image.
   */
  currentImageIndex: number = 0;
  /**
   * Object of type `ButtonsConfig` used to configure buttons visibility. This is a temporary value
   * initialized by the real `buttonsConfig`'s input
   */
  configButtons: ButtonsConfig;
  /**
   * Enum of type `Action` used to pass a click action when you click on the modal image.
   * Declared here to be used inside the template.
   */
  clickAction: Action = Action.CLICK;
  /**
   * Boolean that it's true when you are watching the first image (currently visible).
   */
  isFirstImage: boolean = false;
  /**
   * Boolean that it's true when you are watching the last image (currently visible).
   */
  isLastImage: boolean = false;

  /**
   * Private SWIPE_ACTION to define all swipe actions used by hammerjs.
   */
  private SWIPE_ACTION = {
    LEFT: 'swipeleft',
    RIGHT: 'swiperight',
    UP: 'swipeup',
    DOWN: 'swipedown'
  };

  /**
   * When you pass an Observable of `Image`s as `modalImages`, you have to subscribe to that
   * Observable. So, to prevent memory leaks, you must store the subscription and call `unsubscribe` in
   * OnDestroy.
   */
  private subscription: Subscription;


  /**
   * Listener to catch keyboard's events and call the right method based on the key.
   * For instance, pressing esc, this will call `closeGallery(Action.KEYBOARD)` and so on.
   * If you passed a valid `keyboardConfig` esc, right and left buttons will be customized based on your data.
   * @param e KeyboardEvent caught by the listener.
   */
  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (!this.opened) {
      return;
    }
    const esc: number = this.keyboardConfig && this.keyboardConfig.esc ? this.keyboardConfig.esc : Keyboard.ESC;
    const right: number = this.keyboardConfig && this.keyboardConfig.right ? this.keyboardConfig.right : Keyboard.RIGHT_ARROW;
    const left: number = this.keyboardConfig && this.keyboardConfig.left ? this.keyboardConfig.left : Keyboard.LEFT_ARROW;

    switch (e.keyCode) {
      case esc:
        this.closeGallery(Action.KEYBOARD);
        break;
      case right:
        this.nextImage(Action.KEYBOARD);
        break;
      case left:
        this.prevImage(Action.KEYBOARD);
        break;
    }
  }

  /**
   * Constructor with the injection of ´KeyboardService´ that initialize some description fields
   * based on default values.
   */
  constructor(private keyboardService: KeyboardService) {
    // if description isn't provided initialize it with a default object
    if (!this.description) {
      this.description = {
        imageText: 'Image ',
        numberSeparator: '/',
        beforeTextDescription: ' - '
      };
    }

    // if one of the Description fields isn't initialized, provide a default value
    this.description.imageText = this.description.imageText || 'Image ';
    this.description.numberSeparator = this.description.numberSeparator || '/';
    this.description.beforeTextDescription = this.description.beforeTextDescription || ' - ';
  }

  /**
   * Method ´ngOnInit´ to build `configButtons` and to call `initImages()`.
   * This is an Angular's lifecycle hook, so its called automatically by Angular itself.
   * In particular, it's called only one time!!!
   */
  ngOnInit() {
    // build configButtons to use it inside upper-buttons
    this.configButtons = {
      download: this.showDownloadButton || (this.buttonsConfig && this.buttonsConfig.download),
      extUrl: this.showExtUrlButton || (this.buttonsConfig && this.buttonsConfig.extUrl),
      close: (this.buttonsConfig && this.buttonsConfig.close)
    };

    // call initImages passing true as parameter, because I want to emit `hasData` event
    this.initImages(true);
  }

  /**
   * Method ´ngOnChanges´ to init images preventing errors.
   * This is an Angular's lifecycle hook, so its called automatically by Angular itself.
   * In particular, it's called before `ngOnInit()` and whenever one or more data-bound input properties change.
   * @param changes `SimpleChanges` object of current and previous property values provided by Angular.
   */
  ngOnChanges(changes: SimpleChanges) {
    // to prevent errors when you pass to this library
    // the array of images inside a subscribe block, in this way: `...subscribe(val => { this.images = arrayOfImages })`
    // As you can see, I'm providing examples in these situations in all official demos
    if (this.modalImages) {
      // I pass `false` as parameter, because I DON'T want to emit `hasData`
      // event (preventing multiple hasData events while initializing)
      this.initImages(false);
    }
  }

  /**
   * Method `getDescriptionToDisplay` to get the image description based on input params.
   * If you provide a full description this will be the visible description, otherwise,
   * it will be built using the `description` object, concatenating its fields.
   * @returns String description to display.
   */
  getDescriptionToDisplay() {
    if (this.description && this.description.customFullDescription) {
      return this.description.customFullDescription;
    }
    // If the current image hasn't a description,
    // prevent to write the ' - ' (or this.description.beforeTextDescription)
    if (!this.currentImage.description || this.currentImage.description === '') {
      return `${this.description.imageText}${this.currentImageIndex + 1}${this.description.numberSeparator}${this.images.length}`;
    }
    return `${this.description.imageText}${this.currentImageIndex + 1}${this.description.numberSeparator}${this.images.length}${this.description.beforeTextDescription}${this.currentImage.description}`;
  }

  /**
   * Method `swipe` used by Hammerjs to support touch gestures.
   * @param index Number that represent the current visible index
   * @param action String that represent the direction of the swipe action. 'swiperight' by default.
   */
  swipe(index: number, action = this.SWIPE_ACTION.RIGHT) {
    switch (action) {
      case this.SWIPE_ACTION.RIGHT:
        this.nextImage(Action.SWIPE);
        break;
      case this.SWIPE_ACTION.LEFT:
        this.prevImage(Action.SWIPE);
        break;
      // case this.SWIPE_ACTION.UP:
      //   break;
      // case this.SWIPE_ACTION.DOWN:
      //   break;
    }
  }

  /**
   * Method `closeGallery` to close the modal gallery.
   * @param action Enum of type `Action` that represents the source
   *  action that closed the modal gallery. NORMAL by default.
   */
  closeGallery(action: Action = Action.NORMAL) {
    this.close.emit(new ImageModalEvent(action, true));
    this.opened = false;
    this.keyboardService.reset();
  }

  /**
   * Method `prevImage` to go back to the previous image shown into the modal gallery.
   * @param action Enum of type `Action` that represents the source
   *  action that moved back to the previous image. NORMAL by default.
   */
  prevImage(action: Action = Action.NORMAL) {
    // check if prevImage should be blocked
    if (this.isPreventSliding(0)) {
      return;
    }

    this.loading = true;
    this.currentImageIndex = this.getPrevIndex(action, this.currentImageIndex);
    this.showModalGallery(this.currentImageIndex);
  }

  /**
   * Method `nextImage` to go back to the previous image shown into the modal gallery.
   * @param action Enum of type `Action` that represents the source
   *  action that moved to the next image. NORMAL by default.
   */
  nextImage(action: Action = Action.NORMAL) {
    // check if nextImage should be blocked
    if (this.isPreventSliding(this.images.length - 1)) {
      return;
    }

    this.loading = true;
    this.currentImageIndex = this.getNextIndex(action, this.currentImageIndex);
    this.showModalGallery(this.currentImageIndex);
  }

  /**
   * Method `onShowModalGallery` called when you click on an image of your gallery.
   * The input index is the index of the clicked image thumb.
   * @param index Number that represents the index of the clicked image.
   */
  onShowModalGallery(index: number) {
    this.showModalGallery(index);
  }

  /**
   * Method `showModalGallery` to show the modal gallery displaying the image with
   * the index specified as input parameter.
   * It will also register a new `keyboardService` to catch keyboard's events to download the current
   * image with keyboard's shortcuts. This service, will be removed when modal gallery component will be destroyed.
   * @param index Number that represents the index of the image to show.
   */
  showModalGallery(index: number) {
    this.keyboardService.add((event: KeyboardEvent, combo: string) => {
      if (event.preventDefault) {
        event.preventDefault();
      } else {
        // internet explorer
        event.returnValue = false;
      }
      this.downloadImage();
    });

    // enable/disable 'infinite sliding' based on @Input() slideConfig
    this.manageSlideConfig(index);

    this.currentImageIndex = index;
    this.opened = true;
    this.currentImage = this.images[this.currentImageIndex];
    this.loading = false;

    // emit current visible image index
    this.show.emit(new ImageModalEvent(Action.LOAD, this.currentImageIndex + 1));
  }

  /**
   * Method `downloadImage` to download the current visible image, only if `downloadable` is true.
   * For IE, this will navigate to the image instead of a direct download as in all modern browsers.
   */
  downloadImage() {
    if (!this.downloadable) {
      return;
    }
    // for all browsers
    // Attention: with IE is not working, but it will navigate to the image
    let link = document.createElement('a');
    link.href = this.currentImage.img;
    link.setAttribute('download', this.getFileName(this.currentImage.img));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Method `onClickOutside` to close modal gallery when both `enableCloseOutside` is true and user
   * clicked on the semi-transparent background around the image.
   * @param event Boolean that is true if user clicked on the semi-transparent background, false otherwise.
   */
  onClickOutside(event: boolean) {
    if (event && this.enableCloseOutside) {
      this.closeGallery(Action.CLICK);
    }
  }

  /**
   * Method to get `alt attribute`.
   * `alt` specifies an alternate text for an image, if the image cannot be displayed.
   * There is a similar version of this method into `gallery.component.ts` that
   * receives the image index as input.
   * @param currentImage Image that represents the current visible image.
   */
  getAltDescriptionByImage(currentImage: Image) {
    if (!currentImage) {
      return '';
    }
    if (!currentImage.description) {
      return `Image ${this.images.indexOf(currentImage)}`;
    }
    return currentImage.description;
  }

  /**
   * Method `ngOnDestroy` to cleanup resources. In fact, this will unsubscribe
   * all subscriptions and it will reset keyboard's service.
   */
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.keyboardService.reset();
  }

  /**
   * Private method `getNextIndex` to get the next index, based on the action and the current index.
   * This is necessary because at the end, when you call next again, you'll go to the first image.
   * That happens because all modal images are shown like in a circle.
   * @param action Enum of type Action that represents the source of the event that changed the
   *  current image to the next one.
   * @param currentIndex Number that represents the current index of the visible image.
   */
  private getNextIndex(action: Action, currentIndex: number): number {
    let newIndex: number = 0;
    if (currentIndex >= 0 && currentIndex < this.images.length - 1) {
      newIndex = currentIndex + 1;
    } else {
      newIndex = 0; // start from the first index
    }

    // emit first/last event based on newIndex value
    this.emitBoundaryEvent(action, newIndex);

    // emit current visible image index
    this.show.emit(new ImageModalEvent(action, currentIndex + 1));
    return newIndex;
  }

  /**
   * Private method `getPrevIndex` to get the previous index, based on the action and the current index.
   * This is necessary because at index 0, when you call prev again, you'll go to the last image.
   * That happens because all modal images are shown like in a circle.
   * @param action Enum of type Action that represents the source of the event that changed the
   *  current image to the previous one.
   * @param currentIndex Number that represents the current index of the visible image.
   */
  private getPrevIndex(action: Action, currentIndex: number): number {
    let newIndex: number = 0;
    if (currentIndex > 0 && currentIndex <= this.images.length - 1) {
      newIndex = currentIndex - 1;
    } else {
      newIndex = this.images.length - 1; // start from the last index
    }


    // emit first/last event based on newIndex value
    this.emitBoundaryEvent(action, newIndex);

    // emit current visible image index
    this.show.emit(new ImageModalEvent(action, currentIndex + 1));
    return newIndex;
  }


  /**
   * Private method ´initImages´ to initialize `images` as array of `Image` or as an
   * Observable of `Array<Image>`. Also, it will call completeInitialization.
   * @param emitHasDataEvent boolean to emit `hasData` event while initializing `angular-modal-gallery`.
   *  Use this parameter to prevent multiple `hasData` events.
   */
  private initImages(emitHasDataEvent: boolean = false) {
    if (this.modalImages instanceof Array) {
      this.images = <Array<Image>>this.modalImages;
      this.completeInitialization(emitHasDataEvent);
    } else {
      if (this.modalImages instanceof Observable) {
        this.subscription = (<Observable<Array<Image>>>this.modalImages).subscribe((val: Array<Image>) => {
          this.images = val;
          this.completeInitialization(emitHasDataEvent);
        });
      }
    }
  }

  /**
   * Private method ´completeInitialization´ to emit ImageModalEvent to say that images are loaded. If you are
   * using imagePointer feature, it will also call showModalGallery with imagePointer as parameter.
   * @param emitHasDataEvent boolean to emit `hasData` event while initializing `angular-modal-gallery`.
   *  Use this parameter to prevent multiple `hasData` events.
   */
  private completeInitialization(emitHasDataEvent: boolean) {
    if (emitHasDataEvent) {
      // this will prevent multiple emissions if called from both ngOnInit and ngOnChanges
      this.hasData.emit(new ImageModalEvent(Action.LOAD, true));
    }
    this.loading = true;
    if (this.imagePointer >= 0) {
      this.showGallery = false;
      this.showModalGallery(this.imagePointer);
    } else {
      this.showGallery = true;
    }
  }

  /**
   * Private method `emitBoundaryEvent` to emit events when either the last or the first image are visible.
   * @param action Enum of type Action that represents the source of the event that changed the
   *  current image to the first one or the last one.
   * @param indexToCheck Number of type Action that represents the source of the event that changed the
   *  current image to either the first or the last one.
   */
  private emitBoundaryEvent(action: Action, indexToCheck: number) {
    // to emit first/last event
    switch (indexToCheck) {
      case 0:
        this.firstImage.emit(new ImageModalEvent(action, true));
        break;
      case this.images.length - 1:
        this.lastImage.emit(new ImageModalEvent(action, true));
        break;
    }
  }

  /**
   * Method `getFileName` to get the filename from an input path.
   * This is used to get the image's name from its path.
   * @param path String that represents the path of the image.
   */
  private getFileName(path: string) {
    return path.replace(/^.*[\\\/]/, '');
  }

  /**
   * Method `manageSlideConfig` to manage boundary arrows and sliding.
   * This is based on @Input() slideConfig to enable/disable 'infinite sliding'.
   * @param {number} index Number of the current visible image
   */
  private manageSlideConfig(index: number) {
    if (!this.slideConfig || this.slideConfig.infinite !== false) {
      this.isFirstImage = false;
      this.isLastImage = false;
    } else {
      this.isFirstImage = index === 0;
      this.isLastImage = index === this.images.length - 1;
    }
  }

  /**
   * Method `isPreventSliding` to check if next/prev actions should be blocked.
   * It checks if slideConfig.infinite === false and if the image index is equals to the input parameter.
   * If yes, it returns true to say that sliding should be blocked, otherwise not.
   * @param {number} boundaryIndex Number that could be either the beginning index (0) or the last index
   *  of images (this.images.length - 1).
   * @returns {boolean} True if slideConfig.infinite === false and the current index is
   *  either the first or the last one.
   */
  private isPreventSliding(boundaryIndex: number) {
    return !!this.slideConfig && this.slideConfig.infinite === false &&
      this.currentImageIndex === boundaryIndex;
  }
}
