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
 FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

// The idea to create a carousel with two Subjects came from ng-bootstrap
// So a big thank you to the ng-bootstrap team for the interesting implementation that I used here with some customizations.

import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Subject, timer } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';

import { AccessibleComponent } from '../accessible.component';

import { AccessibilityConfig } from '../../model/accessibility.interface';
import { Image } from '../../model/image.class';
import { InternalLibImage } from '../../model/image-internal.class';
import { Action } from '../../model/action.enum';
import { getIndex } from '../../utils/image.util';
import { NEXT, PREV } from '../../utils/user-input.util';
import { CurrentImageConfig } from '../../model/current-image-config.interface';
import { LoadingConfig, LoadingType } from '../../model/loading-config.interface';
import { Description, DescriptionStrategy, DescriptionStyle } from '../../model/description.interface';
import { DotsConfig } from '../../model/dots-config.interface';
import { SlideConfig } from '../../model/slide-config.interface';

/**
 * Component with configurable inline/plain carousel.
 */
@Component({
  selector: 'ks-carousel',
  styleUrls: ['carousel.scss', '../image-arrows.scss'],
  templateUrl: 'carousel.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselComponent extends AccessibleComponent implements OnInit, AfterContentInit, OnDestroy, OnChanges {
  // @HostBinding('tabindex') tabindex = 0;

  /**
   * Object of type `DotsConfig` to init DotsComponent's features.
   * For instance, it contains a param to show/hide this component.
   */
  @Input()
  dotsConfig: DotsConfig = { visible: true };

  /**
   * Array of `InternalLibImage` that represent the model of this library with all images,
   * thumbs and so on.
   */
  @Input()
  images: InternalLibImage[];

  @Input()
  autoPlay = false;

  @Input()
  interval = 5000;

  @Input()
  isShowArrows = true;

  @Input()
  pauseOnHover = false;

  @Input()
  keyboardNavigation = false;

  /**
   * Interface to configure current image in modal-gallery.
   * For instance you can disable navigation on click on current image (enabled by default).
   */
  @Input()
  currentImageConfig: CurrentImageConfig;

  /**
   * Object of type `SlideConfig` to get `infinite sliding`.
   */
  @Input()
  slideConfig: SlideConfig;

  /**
   * Object of type `DotsConfig` to init DotsComponent's features.
   * For instance, it contains a param to show/hide this component.
   */
  @Input()
  accessibilityConfig: AccessibilityConfig;

  currentImage: InternalLibImage;
  /**
   * Object of type `CurrentImageConfig` exposed to the template. This field is initialized
   * applying transformations, default values and so on to the input of the same type.
   */
  configCurrentImage: CurrentImageConfig;
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
   * Object of type `DotsConfig` exposed to the template. This field is initialized
   * applying transformations, default values and so on to the input of the same type.
   */
  configDots: DotsConfig;

  private _start$ = new Subject<void>();
  private _stop$ = new Subject<void>();

  /**
   * Private object without type to define all swipe actions used by hammerjs.
   */
  private SWIPE_ACTION = {
    LEFT: 'swipeleft',
    RIGHT: 'swiperight',
    UP: 'swipeup',
    DOWN: 'swipedown'
  };

  @HostListener('mouseenter')
  onMouseEnter() {
    if (!this.pauseOnHover) {
      return;
    }
    this.stopCarousel();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (!this.pauseOnHover || !this.autoPlay) {
      return;
    }
    this.playCarousel();
  }

  @HostListener('keydown.arrowLeft')
  onKeyDownLeft() {
    if (!this.keyboardNavigation) {
      return;
    }
    this.prevImage();
  }

  @HostListener('keydown.arrowRight')
  onKeyDownLRight() {
    if (!this.keyboardNavigation) {
      return;
    }
    this.nextImage();
  }

  constructor(@Inject(PLATFORM_ID) private _platformId, private _ngZone: NgZone, private ref: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.currentImage = this.images[0];

    const defaultLoading: LoadingConfig = { enable: true, type: LoadingType.STANDARD };
    const defaultDescriptionStyle: DescriptionStyle = {
      bgColor: 'rgba(0, 0, 0, .5)',
      textColor: 'white',
      marginTop: '0px',
      marginBottom: '0px',
      marginLeft: '0px',
      marginRight: '0px'
    };
    const defaultDescription: Description = {
      strategy: DescriptionStrategy.ALWAYS_VISIBLE,
      imageText: 'Image ',
      numberSeparator: '/',
      beforeTextDescription: ' - ',
      style: defaultDescriptionStyle
    };
    const defaultCurrentImageConfig: CurrentImageConfig = {
      navigateOnClick: true,
      loadingConfig: defaultLoading,
      description: defaultDescription,
      downloadable: false,
      invertSwipe: false
    };

    this.configCurrentImage = Object.assign({}, defaultCurrentImageConfig, this.currentImageConfig);
    this.configCurrentImage.description = Object.assign({}, defaultDescription, this.configCurrentImage.description);

    const defaultConfig: DotsConfig = { visible: true };
    this.configDots = Object.assign(defaultConfig, this.dotsConfig);

    this.manageSlideConfig();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges');
    const autoPlay: SimpleChange = changes.autoPlay;
    // const isShowArrows: SimpleChange = changes.isShowArrows;
    console.log('ngOnchanges autoPlay', autoPlay);
    // console.log('ngOnchanges isShowArrows', isShowArrows);

    if (!autoPlay) {
      return;
    }

    const prevAutoPlay: boolean = autoPlay.previousValue;
    const currentAutoPlay: boolean = autoPlay.currentValue;

    // if (isShowArrows) {
    //   const prevShowArrows: boolean = isShowArrows.previousValue;
    //   const currentShowArrows: boolean = isShowArrows.currentValue;
    //
    //   if (prevShowArrows !== currentShowArrows) {
    //     if (currentShowArrows) {
    //       this.showArrows(true);
    //     } else {
    //       this.showArrows(false);
    //     }
    //   }
    // }

    if (prevAutoPlay !== currentAutoPlay) {
      console.log('prevAutoPlay !== currentAutoPlay');
      if (currentAutoPlay && !autoPlay.isFirstChange()) {
        console.log('currentAutoPlay');
        this._start$.next();
        // this.playCarousel();
      } else {
        console.log('currentAutoPlay false, so stopping...');
        this.stopCarousel();
      }
    }
  }

  ngAfterContentInit() {
    // setInterval() doesn't play well with SSR and protractor,
    // so we should run it in the browser and outside Angular
    console.log('ngAfterContentInit');

    if (isPlatformBrowser(this._platformId)) {
      this._ngZone.runOutsideAngular(() => {
        console.log('ngAfterContentInit 2');
        this._start$
          .pipe(
            map(() => this.interval),
            filter(interval => interval > 0),
            switchMap(interval => timer(interval).pipe(takeUntil(this._stop$)))
          )
          .subscribe(() =>
            this._ngZone.run(() => {
              this.nextImage();
              this.ref.markForCheck();
            })
          );

        this._start$.next();
      });
    }
  }

  /**
   * Method called when a dot is clicked and used to update the current image.
   * @param number index of the clicked dot
   */
  onClickDot(index: number) {
    this.currentImage = this.images[index];
  }

  /**
   * Method called by events from both keyboard and mouse on a navigation arrow.
   * @param string direction of the navigation that can be either 'next' or 'prev'
   * @param KeyboardEvent | MouseEvent event payload
   * @param Action action that triggered the event or `Action.NORMAL` if not provided
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
   * Method to get the image description based on input params.
   * If you provide a full description this will be the visible description, otherwise,
   * it will be built using the `Description` object, concatenating its fields.
   * @param Image image to get its description. If not provided it will be the current image
   * @returns String description of the image (or the current image if not provided)
   * @throws an Error if description isn't available
   */
  getDescriptionToDisplay(image: Image = this.currentImage): string {
    if (!this.configCurrentImage || !this.configCurrentImage.description) {
      throw new Error('Description input must be a valid object implementing the Description interface');
    }

    const imageWithoutDescription: boolean = !image.modal || !image.modal.description || image.modal.description === '';

    switch (this.configCurrentImage.description.strategy) {
      case DescriptionStrategy.HIDE_IF_EMPTY:
        return imageWithoutDescription ? '' : image.modal.description + '';
      case DescriptionStrategy.ALWAYS_HIDDEN:
        return '';
      default:
        // ----------- DescriptionStrategy.ALWAYS_VISIBLE -----------------
        return this.buildTextDescription(image, imageWithoutDescription);
    }
  }

  /**
   * Method used by Hammerjs to support touch gestures (you can also invert the swipe direction with configCurrentImage.invertSwipe).
   * @param action String that represent the direction of the swipe action. 'swiperight' by default.
   */
  swipe(action = this.SWIPE_ACTION.RIGHT) {
    switch (action) {
      case this.SWIPE_ACTION.RIGHT:
        if (this.configCurrentImage.invertSwipe) {
          this.prevImage(Action.SWIPE);
        } else {
          this.nextImage(Action.SWIPE);
        }
        break;
      case this.SWIPE_ACTION.LEFT:
        if (this.configCurrentImage.invertSwipe) {
          this.nextImage(Action.SWIPE);
        } else {
          this.prevImage(Action.SWIPE);
        }
        break;
      // case this.SWIPE_ACTION.UP:
      //   break;
      // case this.SWIPE_ACTION.DOWN:
      //   break;
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
    this.currentImage = this.getPrevImage();

    this.manageSlideConfig();

    this._start$.next();
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
    this.currentImage = this.getNextImage();

    this.manageSlideConfig();

    this._start$.next();
  }

  /**
   * Private method to get the next index.
   * This is necessary because at the end, when you call next again, you'll go to the first image.
   * That happens because all modal images are shown like in a circle.
   */
  private getNextImage(): InternalLibImage {
    const currentIndex: number = getIndex(this.currentImage, this.images);
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
    const currentIndex: number = getIndex(this.currentImage, this.images);
    let newIndex = 0;
    if (currentIndex > 0 && currentIndex <= this.images.length - 1) {
      newIndex = currentIndex - 1;
    } else {
      newIndex = this.images.length - 1; // start from the last index
    }
    return this.images[newIndex];
  }

  /**
   * Method used in the template to track ids in ngFor.
   * @param number index of the array
   * @param Image item of the array
   * @returns number the id of the item
   */
  trackById(index: number, item: Image): number {
    return item.id;
  }

  ngOnDestroy() {
    this.stopCarousel();
  }

  private showArrows(state: boolean) {
    this.isShowArrows = state;
  }

  playCarousel() {
    this._start$.next();
    //   if (isPlatformBrowser(this._platformId)) {
    //     this._ngZone.runOutsideAngular(() => {
    //       this._start$
    //         .pipe(
    //           map(() => this.interval), filter(interval => interval > 0),
    //           switchMap(interval => timer(interval).pipe(takeUntil(this._stop$))))
    //         .subscribe(() => this._ngZone.run(() => this.nextImage()));
    //
    //       this._start$.next();
    //     });
    //     // this._ngZone.runOutsideAngular(() => {
    //     //   this.interval = setInterval(() => {
    //     //     console.log('ciaoooo');
    //     //     this._ngZone.run(() => {
    //     //       this.nextImage();
    //     //       this.ref.markForCheck();
    //     //     });
    //     //   }, this.interval);
    //     // });
    //   }
  }

  // restartCarousel() {
  //   if (isPlatformBrowser(this._platformId)) {
  //     this._ngZone.runOutsideAngular(() => {
  //       this.interval = setInterval(() => {
  //         this._ngZone.run(() => {
  //           this.currentImage = this.images[0];
  //           this.ref.markForCheck();
  //         });
  //       }, this.interval);
  //     });
  //   }
  // }

  /**
   * Stops the carousel from cycling through items.
   */
  stopCarousel() {
    console.log('stoCarousel called');
    this._stop$.next();
  }

  /**
   * Private method to build a text description.
   * This is used also to create titles.
   * @param Image image to get its description. If not provided it will be the current image.
   * @param boolean imageWithoutDescription is a boolean that it's true if the image hasn't a 'modal' description.
   * @returns String description built concatenating image fields with a specific logic.
   */
  private buildTextDescription(image: Image, imageWithoutDescription: boolean): string {
    if (!this.configCurrentImage || !this.configCurrentImage.description) {
      throw new Error('Description input must be a valid object implementing the Description interface');
    }

    // If customFullDescription use it, otherwise proceed to build a description
    if (this.configCurrentImage.description.customFullDescription && this.configCurrentImage.description.customFullDescription !== '') {
      return this.configCurrentImage.description.customFullDescription;
    }

    const currentIndex: number = getIndex(image, this.images);
    // If the current image hasn't a description,
    // prevent to write the ' - ' (or this.description.beforeTextDescription)

    const prevDescription: string = this.configCurrentImage.description.imageText ? this.configCurrentImage.description.imageText : '';
    const midSeparator: string = this.configCurrentImage.description.numberSeparator ? this.configCurrentImage.description.numberSeparator : '';
    const middleDescription: string = currentIndex + 1 + midSeparator + this.images.length;

    if (imageWithoutDescription) {
      return prevDescription + middleDescription;
    }

    const currImgDescription: string = image.modal && image.modal.description ? image.modal.description : '';
    const endDescription: string = this.configCurrentImage.description.beforeTextDescription + currImgDescription;
    return prevDescription + middleDescription + endDescription;
  }

  /**
   * Private method to update both `isFirstImage` and `isLastImage` based on
   * the index of the current image.
   * @param number currentIndex is the index of the current image
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
      default:
        this.isFirstImage = false;
        this.isLastImage = false;
        break;
    }
  }

  /**
   * Private method to manage boundary arrows and sliding.
   * This is based on the slideConfig input to enable/disable 'infinite sliding'.
   * @param number index of the visible image
   */
  private manageSlideConfig() {
    let index: number;
    try {
      index = getIndex(this.currentImage, this.images);
    } catch (err) {
      console.error('Cannot get the current image index in current-image');
      throw err;
    }
    console.log('next index', index);

    if (!this.slideConfig || this.slideConfig.infinite === true) {
      // enable infinite sliding
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
   * @param number boundaryIndex that could be either the beginning index (0) or the last index
   *  of images (this.images.length - 1).
   * @returns boolean true if slideConfig.infinite === false and the current index is
   *  either the first or the last one.
   */
  private isPreventSliding(boundaryIndex: number): boolean {
    return !!this.slideConfig && this.slideConfig.infinite === false && getIndex(this.currentImage, this.images) === boundaryIndex;
  }
}
