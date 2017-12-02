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
 * Component with the current image with
 * some additional elements like arrows
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

  @Input() currentImage: InternalLibImage;

  @Input() slideConfig: SlideConfig;

  /**
   * Array of `Image` that represent the model of this library with all images, thumbs and so on.
   */
  @Input() images: InternalLibImage[];

  @Input() isOpen: boolean;

  /**
   * Description object with the configuration to show image descriptions.
   */
  @Input() descriptionConfig: Description;

  @Input() loadingConfig: LoadingConfig;

  /**
   * Object of type `KeyboardConfig` to assign custom keys to ESC, RIGHT and LEFT keyboard's actions.
   */
  @Input() keyboardConfig: KeyboardConfig;

  @Input() accessibilityConfig: AccessibilityConfig;

  @Output() loadImage: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeImage: EventEmitter<ImageModalEvent> = new EventEmitter<ImageModalEvent>();
  @Output() close: EventEmitter<ImageModalEvent> = new EventEmitter<ImageModalEvent>();

  /**
   * Enum of type `Action` used to pass a click action when you click on the modal image.
   * Declared here to be used inside the template.
   */
  clickAction: Action = Action.CLICK;

  /**
   * Boolean that it's true when you are watching the first image (currently visible).
   */
  isFirstImage = false;
  /**
   * Boolean that it's true when you are watching the last image (currently visible).
   */
  isLastImage = false;
  /**
   * Boolean that it is true if an image of the modal gallery is still loading.
   * True by default
   */
  loading = true;

  configLoading: LoadingConfig;

  /**
   * Private SWIPE_ACTION to define all swipe actions used by hammerjs.
   */
  private SWIPE_ACTION = {
    LEFT: 'swipeleft',
    RIGHT: 'swiperight',
    UP: 'swipeup',
    DOWN: 'swipedown'
  };

  private description: Description;

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

  ngOnChanges(changes: SimpleChanges) {
    const simpleChange: SimpleChange = changes.currentImage;
    if (!simpleChange) {
      return;
    }
    const prev: InternalLibImage = simpleChange.previousValue;
    const current: InternalLibImage = simpleChange.currentValue;

    // console.log('ngOnChanges - prev ', prev);
    // console.log('ngOnChanges - current ', current);

    // if before was loaded, but not not
    if (prev && current && prev.previouslyLoaded && !current.previouslyLoaded) {
      this.loading = !current.previouslyLoaded;
      // console.log('Refreshing with loading: ' + this.loading);
      this.changeImage.emit(new ImageModalEvent(Action.LOAD, this.getIndex(this.currentImage)));
      this.loading = false;
    }

    if (this.isOpen) {
      this.manageSlideConfig(this.getIndex(this.currentImage));
    }
  }

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
   * Method `getDescriptionToDisplay` to get the image description based on input params.
   * If you provide a full description this will be the visible description, otherwise,
   * it will be built using the `description` object, concatenating its fields.
   * @returns String description to display.
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
   * @param image Image that represents the current visible image.
   */
  getAltDescriptionByImage(image: Image = this.currentImage): string {
    if (!image) {
      return '';
    }
    return !image.description ? `Image ${this.getIndex(image)}` : image.description;
  }

  getIndex(image: Image, arrayOfImages: Image[] = this.images): number {
    // id is mandatory. You can use either numbers or strings.
    // If the id is 0, I shouldn't throw an error.
    if (!image || (!image.id && image.id !== 0)) {
      throw new Error(`Image 'id' is mandatory`);
    }
    return arrayOfImages.findIndex((val: Image) => val.id === image.id);
  }

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

  onImageEvent(event: KeyboardEvent | MouseEvent, action: Action = Action.NORMAL) {
    const result: number = super.handleImageEvent(event);
    if (result === NEXT) {
      this.nextImage(action);
    }
  }

  onNavigationEvent(direction: string, event: KeyboardEvent, action: Action = Action.NORMAL) {
    const result: number = super.handleNavigationEvent(direction, event);
    if (result === NEXT) {
      this.nextImage(action);
    } else if (result === PREV) {
      this.prevImage(action);
    }
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
    const prevImage: InternalLibImage = this.getPrevImage(action);
    this.loading = !prevImage.previouslyLoaded;
    this.changeImage.emit(new ImageModalEvent(action, this.getIndex(prevImage)));
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
    const nextImage: InternalLibImage = this.getNextImage(action);
    this.loading = !nextImage.previouslyLoaded;
    this.changeImage.emit(new ImageModalEvent(action, this.getIndex(nextImage)));
  }

  onImageLoad(event: Event) {
    this.loadImage.emit({
      status: true,
      index: this.getIndex(this.currentImage),
      id: this.currentImage.id
    });

    this.loading = false;
  }

  /**
   * Method `swipe` used by Hammerjs to support touch gestures.
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
   * Method `manageSlideConfig` to manage boundary arrows and sliding.
   * This is based on @Input() slideConfig to enable/disable 'infinite sliding'.
   * @param {number} index Number of the current visible image
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
   * Method `isPreventSliding` to check if next/prev actions should be blocked.
   * It checks if slideConfig.infinite === false and if the image index is equals to the input parameter.
   * If yes, it returns true to say that sliding should be blocked, otherwise not.
   * @param {number} boundaryIndex Number that could be either the beginning index (0) or the last index
   *  of images (this.images.length - 1).
   * @returns {boolean} True if slideConfig.infinite === false and the current index is
   *  either the first or the last one.
   */
  private isPreventSliding(boundaryIndex: number): boolean {
    return !!this.slideConfig && this.slideConfig.infinite === false &&
      this.getIndex(this.currentImage) === boundaryIndex;
  }


  /**
   * Private method `getNextIndex` to get the next index, based on the action and the current index.
   * This is necessary because at the end, when you call next again, you'll go to the first image.
   * That happens because all modal images are shown like in a circle.
   * @param action Enum of type Action that represents the source of the event that changed the
   *  current image to the next one.
   */
  private getNextImage(action: Action): InternalLibImage {
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
   * Private method `getPrevIndex` to get the previous index, based on the action and the current index.
   * This is necessary because at index 0, when you call prev again, you'll go to the last image.
   * That happens because all modal images are shown like in a circle.
   * @param action Enum of type Action that represents the source of the event that changed the
   *  current image to the previous one.
   */
  private getPrevImage(action: Action): InternalLibImage {
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
