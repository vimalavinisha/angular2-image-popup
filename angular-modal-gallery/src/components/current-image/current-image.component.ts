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
 FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { Keyboard } from '../../interfaces/keyboard.enum';
import { Image, ImageModalEvent } from '../../interfaces/image.class';
import { Action } from '../../interfaces/action.enum';
import { InternalLibImage } from '../modal-gallery/modal-gallery.component';
import { Description, DescriptionStrategy } from '../../interfaces/description.interface';
import { KeyboardConfig } from '../../interfaces/keyboard-config.interface';
import { LoadingConfig, LoadingType } from '../../interfaces/loading-config.interface';
import { SlideConfig } from '../../interfaces/slide-config.interface';
import { AccessibilityConfig } from '../../interfaces/accessibility.interface';
import { AccessibleComponent } from '../accessible.component';
import { NEXT, PREV } from '../../utils/user-input.util';

/**
 * Interface to describe the Load Event, used to
 * emit an event when the image is finally loaded and the spinner has gone.
 */
export interface ImageLoadEvent {
  status: boolean;
  index: number;
  id: number;
}

/**
 * Component with the current image with some additional elements like arrows and side previews.
 */
@Component({
  selector: 'ks-current-image',
  styleUrls: [
    'current-image.scss',
    'current-image-arrows.scss',
    'current-image-previews.scss'
  ],
  templateUrl: 'current-image.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentImageComponent extends AccessibleComponent implements OnInit, OnChanges {
  /**
   * Input of type `InternalLibImage` that represent the visible image.
   */
  @Input() currentImage: InternalLibImage;
  /**
   * Input of type Array of `InternalLibImage` that represent the model of this library with all images,
   * thumbs and so on.
   */
  @Input() images: InternalLibImage[];
  /**
   * Input of type boolean that it is true if the modal gallery is visible.
   * If yes, also this component should be visible.
   */
  @Input() isOpen: boolean;
  /**
   * Object of type `LoadingConfig` that contains fields like enable/disable
   * and a way to choose a loading spinner.
   */
  @Input() loadingConfig: LoadingConfig;
  /**
   * Input of type `SlideConfig` to get `infinite sliding`.
   */
  @Input() slideConfig: SlideConfig;
  /**
   * Object of type `AccessibilityConfig` to init custom accessibility features.
   * For instance, it contains titles, alt texts, aria-labels and so on.
   */
  @Input() accessibilityConfig: AccessibilityConfig;
  /**
   * Object of type `Description` to configure and show image descriptions.
   */
  @Input() descriptionConfig: Description;
  /**
   * Object of type `KeyboardConfig` to assign custom keys to ESC, RIGHT and LEFT keyboard's actions.
   */
  @Input() keyboardConfig: KeyboardConfig;

  /**
   * Output to emit an event when images are loaded. The payload contains an `ImageLoadEvent`.
   */
  @Output() loadImage: EventEmitter<ImageLoadEvent> = new EventEmitter<ImageLoadEvent>();
  /**
   * Output to emit any changes of the current image. The payload contains an `ImageModalEvent`.
   */
  @Output() changeImage: EventEmitter<ImageModalEvent> = new EventEmitter<ImageModalEvent>();
  /**
   * Output to emit an event when the modal gallery is closed. The payload contains an `ImageModalEvent`.
   */
  @Output() close: EventEmitter<ImageModalEvent> = new EventEmitter<ImageModalEvent>();

  /**
   * Enum of type `Action` that represents a mouse click on a button.
   * Declared here to be used inside the template.
   */
  clickAction: Action = Action.CLICK;
  /**
   * Boolean that it's true when you are watching the first image (currently visible).
   * False by default
   */
  isFirstImage = false;
  /**
   * Boolean that it's true when you are watching the last image (currently visible).
   * False by default
   */
  isLastImage = false;
  /**
   * Boolean that it's true if an image of the modal gallery is still loading.
   * True by default
   */
  loading = true;
  /**
   * Object of type `LoadingConfig` exposed to the template. This field is initialized
   * applying transformations, default values and so on to the input of the same type.
   */
  configLoading: LoadingConfig;

  /**
   * Private object without type to define all swipe actions used by hammerjs.
   */
  private SWIPE_ACTION = {
    LEFT: 'swipeleft',
    RIGHT: 'swiperight',
    UP: 'swipeup',
    DOWN: 'swipedown'
  };
  /**
   * Private `Description` object initialized applying transformations, default values
   * and so on to the input of the same type.
   */
  private description: Description;

  /**
   * Method ´ngOnInit´ to build both `defaultLoading` and `defaultDescription` applying default values.
   * This is an Angular's lifecycle hook, so its called automatically by Angular itself.
   * In particular, it's called only one time!!!
   */
  ngOnInit() {
    const defaultLoading: LoadingConfig = {enable: true, type: LoadingType.STANDARD};
    const defaultDescription: Description = {
      strategy: DescriptionStrategy.ALWAYS_VISIBLE,
      imageText: 'Image ',
      numberSeparator: '/',
      beforeTextDescription: ' - '
    };
    this.configLoading = Object.assign(defaultLoading, this.loadingConfig);
    this.description = Object.freeze(Object.assign(defaultDescription, this.descriptionConfig));
  }

  /**
   * Method ´ngOnChanges´ to update `loading` status and emit events.
   * If the gallery is open, then it will also manage boundary arrows and sliding.
   * This is an Angular's lifecycle hook, so its called automatically by Angular itself.
   * In particular, it's called when any data-bound property of a directive changes!!!
   */
  ngOnChanges(changes: SimpleChanges) {
    const simpleChange: SimpleChange = changes.currentImage;
    if (!simpleChange) {
      return;
    }
    const prev: InternalLibImage = simpleChange.previousValue;
    const current: InternalLibImage = simpleChange.currentValue;

    // if was loaded before, but not now
    if (prev && current && prev.previouslyLoaded && !current.previouslyLoaded) {
      this.loading = !current.previouslyLoaded;
      this.changeImage.emit(new ImageModalEvent(Action.LOAD, this.getIndex(this.currentImage)));
      this.loading = false;
    }

    if (this.isOpen) {
      this.manageSlideConfig(this.getIndex(this.currentImage));
    }
  }

  /**
   * Method to handle keypress based on the `keyboardConfig` input. It gets the keyCode of
   * the key that triggered the keypress event to navigate between images or to close the modal gallery.
   * @param {number} keyCode of the key that triggered the keypress event
   */
  onKeyPress(keyCode: number) {
    const esc: number = this.keyboardConfig && this.keyboardConfig.esc ? this.keyboardConfig.esc : Keyboard.ESC;
    const right: number = this.keyboardConfig && this.keyboardConfig.right ? this.keyboardConfig.right : Keyboard.RIGHT_ARROW;
    const left: number = this.keyboardConfig && this.keyboardConfig.left ? this.keyboardConfig.left : Keyboard.LEFT_ARROW;

    switch (keyCode) {
      case esc:
        this.close.emit(new ImageModalEvent(Action.KEYBOARD, true));
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
   * Method to get the image description based on input params.
   * If you provide a full description this will be the visible description, otherwise,
   * it will be built using the `Description` object, concatenating its fields.
   * @param {Image} image to get its description. If not provided it will be the current image
   * @returns String description of the image (or the current image if not provided)
   * @throws an Error if description isn't available
   */
  getDescriptionToDisplay(image: Image = this.currentImage): string {
    if (!this.description) {
      throw new Error('Description input must be a valid object implementing the Description interface');
    }

    const imageWithoutDescription: boolean = !image.description || image.description === '';

    switch (this.description.strategy) {
      case DescriptionStrategy.HIDE_IF_EMPTY:
        return imageWithoutDescription ? '' : image.description + '';
      case DescriptionStrategy.ALWAYS_HIDDEN:
        return '';
    }

    const currentIndex: number = this.getIndex(image);
    // If the current image hasn't a description,
    // prevent to write the ' - ' (or this.description.beforeTextDescription)

    const prevDescription: string = this.description.imageText ? this.description.imageText : '';
    const midSeparator: string = this.description.numberSeparator ? this.description.numberSeparator : '';
    const middleDescription: string = (currentIndex + 1) + midSeparator + this.images.length;

    if (imageWithoutDescription) {
      return prevDescription + middleDescription;
    }

    const currImgDescription: string = image.description ? image.description : '';
    const endDescription: string = this.description.beforeTextDescription + currImgDescription;
    return prevDescription + middleDescription + endDescription;
  }

  /**
   * Method to get `alt attribute`.
   * `alt` specifies an alternate text for an image, if the image cannot be displayed.
   * There is a similar version of this method into `gallery.component.ts` that
   * receives the image index as input.
   * @param {Image} image to get its alt description. If not provided it will be the current image
   * @returns String alt description of the image (or the current image if not provided)
   */
  getAltDescriptionByImage(image: Image = this.currentImage): string {
    if (!image) {
      return '';
    }
    return !image.description ? `Image ${this.getIndex(image)}` : image.description;
  }

  /**
   * Method to get the index of an image.
   * @param {Image} image to get the index, or the visible image, if not passed
   * @param {Image[]} arrayOfImages to search the image within it
   * @returns {number} the index of the image
   */
  getIndex(image: Image = this.currentImage, arrayOfImages: Image[] = this.images): number {
    // id is mandatory. You can use either numbers or strings.
    // If the id is 0, I shouldn't throw an error.
    if (!image || (!image.id && image.id !== 0)) {
      throw new Error(`Image 'id' is mandatory`);
    }
    return arrayOfImages.findIndex((val: Image) => val.id === image.id);
  }

  /**
   * Method to get the left side preview image.
   * @returns {Image} the image to show as size preview on the left
   */
  getLeftPreviewImage(): Image {
    const currentIndex: number = this.getIndex(this.currentImage);
    if (currentIndex === 0 && this.slideConfig.infinite) {
      // the current image is the first one,
      // so the previous one is the last image
      // because infinite is true
      return this.images[this.images.length - 1];
    }
    this.handleBoundaries(currentIndex);
    return this.images[Math.max(currentIndex - 1, 0)];
  }

  /**
   * Method to get the right side preview image.
   * @returns {Image} the image to show as size preview on the right
   */
  getRightPreviewImage(): Image {
    const currentIndex: number = this.getIndex(this.currentImage);
    if (currentIndex === this.images.length - 1 && this.slideConfig.infinite) {
      // the current image is the last one,
      // so the next one is the first image
      // because infinite is true
      return this.images[0];
    }
    this.handleBoundaries(currentIndex);
    return this.images[Math.min(currentIndex + 1, this.images.length - 1)];
  }

  /**
   * Method called by events from both keyboard and mouse on an image.
   * This will invoke the nextImage method.
   * @param {KeyboardEvent | MouseEvent} event payload
   * @param {Action} action that triggered the event or `Action.NORMAL` if not provided
   */
  onImageEvent(event: KeyboardEvent | MouseEvent, action: Action = Action.NORMAL) {
    const result: number = super.handleImageEvent(event);
    if (result === NEXT) {
      this.nextImage(action);
    }
  }

  /**
   * Method called by events from both keyboard and mouse on a navigation arrow.
   * @param {string} direction of the navigation that can be either 'next' or 'prev'
   * @param {KeyboardEvent | MouseEvent} event payload
   * @param {Action} action that triggered the event or `Action.NORMAL` if not provided
   */
  onNavigationEvent(direction: string, event: KeyboardEvent, action: Action = Action.NORMAL) {
    const result: number = super.handleNavigationEvent(direction, event);
    if (result === NEXT) {
      this.nextImage(action);
    } else if (result === PREV) {
      this.prevImage(action);
    }
  }

  /**
   * Method to go back to the previous image.
   * @param action Enum of type `Action` that represents the source
   *  action that moved back to the previous image. `Action.NORMAL` by default.
   */
  prevImage(action: Action = Action.NORMAL) {
    // check if prevImage should be blocked
    if (this.isPreventSliding(0)) {
      return;
    }
    const prevImage: InternalLibImage = this.getPrevImage();
    this.loading = !prevImage.previouslyLoaded;
    this.changeImage.emit(new ImageModalEvent(action, this.getIndex(prevImage)));
  }

  /**
   * Method to go back to the previous image.
   * @param action Enum of type `Action` that represents the source
   *  action that moved to the next image. `Action.NORMAL` by default.
   */
  nextImage(action: Action = Action.NORMAL) {
    // check if nextImage should be blocked
    if (this.isPreventSliding(this.images.length - 1)) {
      return;
    }
    const nextImage: InternalLibImage = this.getNextImage();
    this.loading = !nextImage.previouslyLoaded;
    this.changeImage.emit(new ImageModalEvent(action, this.getIndex(nextImage)));
  }

  /**
   * Method to emit an event as loadImage output to say that the requested image if loaded.
   * This method is invoked by the javascript's 'load' event on an img tag.
   * @param {Event} event that triggered the load
   */
  onImageLoad(event: Event) {
    this.loadImage.emit({
      status: true,
      index: this.getIndex(this.currentImage),
      id: this.currentImage.id
    });

    this.loading = false;
  }

  /**
   * Method used by Hammerjs to support touch gestures.
   * @param action String that represent the direction of the swipe action. 'swiperight' by default.
   */
  swipe(action = this.SWIPE_ACTION.RIGHT) {
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
   * Private method to update both `isFirstImage` and `isLastImage` based on
   * the index of the current image.
   * @param {number} currentIndex is the index of the current image
   */
  private handleBoundaries(currentIndex: number) {
    if (this.images.length === 1) {
      this.isFirstImage = true;
      this.isLastImage = true;
      return;
    }
    switch (currentIndex) {
      case 0:
        // execute this only if infinite sliding is disabled
        this.isFirstImage = true;
        this.isLastImage = false;
        break;
      case this.images.length - 1:
        // execute this only if infinite sliding is disabled
        this.isFirstImage = false;
        this.isLastImage = true;
        break;
    }
  }

  /**
   * Private method to manage boundary arrows and sliding.
   * This is based on the slideConfig input to enable/disable 'infinite sliding'.
   * @param {number} index of the visible image
   */
  private manageSlideConfig(index: number) {
    if (!this.slideConfig || this.slideConfig.infinite !== false) {
      this.isFirstImage = false;
      this.isLastImage = false;
    } else {
      this.handleBoundaries(index);
    }
  }

  /**
   * Private method to check if next/prev actions should be blocked.
   * It checks if slideConfig.infinite === false and if the image index is equals to the input parameter.
   * If yes, it returns true to say that sliding should be blocked, otherwise not.
   * @param {number} boundaryIndex that could be either the beginning index (0) or the last index
   *  of images (this.images.length - 1).
   * @returns {boolean} true if slideConfig.infinite === false and the current index is
   *  either the first or the last one.
   */
  private isPreventSliding(boundaryIndex: number): boolean {
    return !!this.slideConfig && this.slideConfig.infinite === false &&
      this.getIndex(this.currentImage) === boundaryIndex;
  }

  /**
   * Private method to get the next index.
   * This is necessary because at the end, when you call next again, you'll go to the first image.
   * That happens because all modal images are shown like in a circle.
   */
  private getNextImage(): InternalLibImage {
    const currentIndex: number = this.getIndex(this.currentImage);
    let newIndex = 0;
    if (currentIndex >= 0 && currentIndex < this.images.length - 1) {
      newIndex = currentIndex + 1;
    } else {
      newIndex = 0; // start from the first index
    }
    return this.images[newIndex];
  }

  /**
   * Private method to get the previous index.
   * This is necessary because at index 0, when you call prev again, you'll go to the last image.
   * That happens because all modal images are shown like in a circle.
   */
  private getPrevImage(): InternalLibImage {
    const currentIndex: number = this.getIndex(this.currentImage);
    let newIndex = 0;
    if (currentIndex > 0 && currentIndex <= this.images.length - 1) {
      newIndex = currentIndex - 1;
    } else {
      newIndex = this.images.length - 1; // start from the last index
    }
    return this.images[newIndex];
  }
}
