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

import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { Keyboard } from '../../interfaces/keyboard.enum';
import { Image, ImageModalEvent } from '../../interfaces/image.class';
import { Action } from '../../interfaces/action.enum';
import { InternalLibImage } from '../modal-gallery/modal-gallery.component';
import { Description, DescriptionStrategy } from '../../interfaces/description.interface';
import { KeyboardConfig } from '../../interfaces/keyboard-config.interface';
import { LoadingConfig } from '../../interfaces/loading-config.interface';
import { SlideConfig } from '../../interfaces/slide-config.interface';
import { AccessibilityConfig } from '../../interfaces/accessibility.interface';

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
export class CurrentImageComponent implements OnChanges, OnDestroy {

  private static SPACE_KEY = 32;
  private static ENTER_KEY = 13;
  private static MOUSE_MAIN_BUTTON_CLICK = 0;

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
  @Input() descriptionConfig: Description = {strategy: DescriptionStrategy.ALWAYS_VISIBLE};

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

  /**
   * Constructor that initialize some description fields
   * based on default values.
   */
  constructor() {
    // copy input Description to a local variable
    this.description = Object.assign({}, this.descriptionConfig);

    if (this.description.strategy === DescriptionStrategy.ALWAYS_VISIBLE) {
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
  }

  ngOnChanges() {
    if (this.isOpen) {
      this.manageSlideConfig(this.getIndex(this.currentImage));
    }
  }

  /**
   * Listener to catch keyboard's events and call the right method based on the key.
   * For instance, pressing esc, this will call `closeGallery(Action.KEYBOARD)` and so on.
   * If you passed a valid `keyboardConfig` esc, right and left buttons will be customized based on your data.
   * @param e KeyboardEvent caught by the listener.
   */
  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (!this.isOpen) {
      return;
    }
    const esc: number = this.keyboardConfig && this.keyboardConfig.esc ? this.keyboardConfig.esc : Keyboard.ESC;
    const right: number = this.keyboardConfig && this.keyboardConfig.right ? this.keyboardConfig.right : Keyboard.RIGHT_ARROW;
    const left: number = this.keyboardConfig && this.keyboardConfig.left ? this.keyboardConfig.left : Keyboard.LEFT_ARROW;

    switch (e.keyCode) {
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
    if (this.description && this.description.customFullDescription) {
      return this.description.customFullDescription;
    }
    const currentIndex: number = this.getIndex(image);
    // If the current image hasn't a description,
    // prevent to write the ' - ' (or this.description.beforeTextDescription)
    if (!image.description || image.description === '') {
      return `${this.description.imageText}${currentIndex + 1}${this.description.numberSeparator}${this.images.length}`;
    }
    return `${this.description.imageText}${currentIndex + 1}${this.description.numberSeparator}${this.images.length}${this.description.beforeTextDescription}${image.description}`;
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
    if (!image.description) {
      const index: number = this.getIndex(image);
      return `Image ${index}`;
    }
    return image.description;
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
    return this.images[Math.max(this.getIndex(this.currentImage) - 1, 0)];
  }

  getRightPreviewImage(): Image {
    return this.images[Math.min(this.getIndex(this.currentImage) + 1, this.images.length - 1)];
  }

  onImageEvent(event: KeyboardEvent | MouseEvent, action: Action = Action.NORMAL) {
    if (event instanceof KeyboardEvent && event) {
      const key: number = event.keyCode;

      if (key === CurrentImageComponent.SPACE_KEY || key === CurrentImageComponent.ENTER_KEY) {
        this.nextImage(action);
        return;
      }
    }

    if (event instanceof MouseEvent && event) {
      const mouseBtn: number = event.button;

      if (mouseBtn === CurrentImageComponent.MOUSE_MAIN_BUTTON_CLICK) {
        this.nextImage(action);
      }
    }
  }

  onNavigationEvent(direction: string, event: KeyboardEvent | MouseEvent, action: Action = Action.NORMAL) {
    console.log('onEvent direction: ' + direction);
    console.log('onEvent event:', event);

    if (event instanceof KeyboardEvent && event) {
      const key: number = event.keyCode;

      if (key === CurrentImageComponent.SPACE_KEY || key === CurrentImageComponent.ENTER_KEY) {
        if (direction === 'right') {
          this.nextImage(action);
        } else {
          this.prevImage(action);
        }
        return;
      }
    }

    if (event instanceof MouseEvent && event) {
      const mouseBtn: number = event.button;

      if (mouseBtn === CurrentImageComponent.MOUSE_MAIN_BUTTON_CLICK) {
        if (direction === 'right') {
          this.nextImage(action);
        } else {
          this.prevImage(action);
        }
      }
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

    console.log('prevImage is', prevImage);

    if (!prevImage.previouslyLoaded) {
      console.log('--NOT previously loaded, so LOADING...--');
      this.loading = true;
    } else {
      console.log('--already loaded--');
      this.loading = false;
    }

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
    if (!nextImage.previouslyLoaded) {
      console.log('--NOT previously loaded, so LOADING...--');
      this.loading = true;
    } else {
      console.log('--already loaded--');
      this.loading = false;
    }

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
   * Method `showModalGallery` to show the modal gallery displaying the image with
   * the index specified as input parameter.
   * It will also register a new `keyboardService` to catch keyboard's events to download the current
   * image with keyboard's shortcuts. This service, will be removed when modal gallery component will be destroyed.
   * @param index Number that represents the index of the image to show.
   */
  // showModalGallery(index: number) {
  // this.keyboardService.add((event: KeyboardEvent, combo: string) => {
  //   if (event.preventDefault) {
  //     event.preventDefault();
  //   } else {
  //     // internet explorer
  //     event.returnValue = false;
  //   }
  //   this.downloadImage();
  // });
  //
  // // enable/disable 'infinite sliding' based on @Input() slideConfig
  // this.manageSlideConfig(index);
  //
  // this.currentImageIndex = index;
  // this.opened = true;
  // this.currentImage = this.images[this.currentImageIndex];
  // this.loading = false;
  //
  // emit current visible image index
  // this.show.emit(new ImageModalEvent(Action.LOAD, this.currentImageIndex + 1));
  // }

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

  /**
   * Method `ngOnDestroy` to cleanup resources.
   */
  ngOnDestroy() {
    console.log('CALLED ON DESTROY OF CURRENT_IMAGE_COMPONENT');
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
