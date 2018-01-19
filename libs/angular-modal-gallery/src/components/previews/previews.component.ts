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

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';

import { AccessibleComponent } from '../accessible.component';

import { AccessibilityConfig } from '../../model/accessibility.interface';
import { Image } from '../../model/image.class';
import { InternalLibImage } from '../../model/image-internal.class';
import { Size } from '../../model/size.interface';
import { PreviewConfig } from '../../model/preview-config.interface';
import { SlideConfig } from '../../model/slide-config.interface';

import { NEXT, PREV } from '../../utils/user-input.util';
import { getIndex } from '../../utils/image.util';

/**
 * Component with image previews
 */
@Component({
  selector: 'ks-previews',
  styleUrls: ['previews.scss', 'previews-arrows.scss'],
  templateUrl: 'previews.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewsComponent extends AccessibleComponent implements OnInit, OnChanges {
  /**
   * Object of type `InternalLibImage` that represent the visible image.
   */
  @Input() currentImage: InternalLibImage;
  /**
   * Array of `InternalLibImage` that represent the model of this library with all images,
   * thumbs and so on.
   */
  @Input() images: InternalLibImage[];
  /**
   * Object of type `SlideConfig` to get `infinite sliding`.
   */
  @Input() slideConfig: SlideConfig;
  /**
   * Object of type `PreviewConfig` to init PreviewsComponent's features.
   * For instance, it contains a param to show/hide this component, sizes.
   */
  @Input() previewConfig: PreviewConfig;
  /**
   * Object of type `AccessibilityConfig` to init custom accessibility features.
   * For instance, it contains titles, alt texts, aria-labels and so on.
   */
  @Input() accessibilityConfig: AccessibilityConfig;
  /**
   * Output to emit the clicked preview. The payload contains the `InternalLibImage` associated to the clicked preview.
   */
  @Output() clickPreview: EventEmitter<InternalLibImage> = new EventEmitter<InternalLibImage>();

  /**
   * Array of `InternalLibImage` exposed to the template. This field is initialized
   * applying transformations, default values and so on to the input of the same type.
   */
  previews: InternalLibImage[] = [];
  /**
   * Object of type `PreviewConfig` exposed to the template. This field is initialized
   * applying transformations, default values and so on to the input of the same type.
   */
  configPreview: PreviewConfig;

  /**
   * Start index of the input images used to display previews.
   */
  start: number;
  /**
   * End index of the input images used to display previews.
   */
  end: number;

  /**
   * Default preview's size object
   */
  private defaultPreviewSize: Size = { height: '50px', width: 'auto' };
  /**
   * Default preview's config object
   */
  private defaultPreviewConfig: PreviewConfig = {
    visible: true,
    number: 3,
    arrows: true,
    clickable: true,
    alwaysCenter: false, // TODO still not implemented
    size: this.defaultPreviewSize
  };

  /**
   * Method ´ngOnInit´ to build `configPreview` applying a default value and also to
   * init the `previews` array.
   * This is an Angular's lifecycle hook, so its called automatically by Angular itself.
   * In particular, it's called only one time!!!
   */
  ngOnInit() {
    console.log('-------------------------------------------------------1a', this.previewConfig);
    console.log('-------------------------------------------------------1b', this.defaultPreviewConfig);
    this.configPreview = Object.assign(this.defaultPreviewConfig, this.previewConfig);
    console.log('-------------------------------------------------------1c', this.configPreview);

    let index: number;
    try {
      index = getIndex(this.currentImage, this.images);
    } catch (err) {
      console.error('Error while initializing angular-modal-gallery previews component');
      throw err;
    }
    console.log('-------------------------------------------------------1d', index);
    switch (index) {
      case 0:
        // first image
        console.log('-------------------------------------------------------2');
        this.setBeginningIndexesPreviews();
        break;
      case this.images.length - 1:
        // last image
        console.log('-------------------------------------------------------3');
        this.setEndIndexesPreviews();
        break;
      default:
        // other images
        console.log('-------------------------------------------------------4');
        this.setIndexesPreviews();
        break;
    }
    console.log('-------------------------------------------------------5');
    this.previews = this.images.filter((img: InternalLibImage, i: number) => i >= this.start && i < this.end);
    console.log('-------------------------------------------------------6');
  }

  /**
   * Method to check if an image is active (i.e. a preview image).
   * @param {InternalLibImage} preview is an image to check if it's active or not
   * @returns {boolean} true if is active, false otherwise
   */
  isActive(preview: InternalLibImage): boolean {
    if (!preview || !this.currentImage) {
      return false;
    }
    return preview.id === this.currentImage.id;
  }

  // TODO improve this method to simplify the sourcecode + remove duplicated codelines
  /**
   * Method ´ngOnChanges´ to update `previews` array.
   * Also, both `start` and `end` local variables will be updated accordingly.
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

    if (prev && current && prev.id !== current.id) {
      // to manage infinite sliding I have to reset both `start` and `end` at the beginning
      // to show again previews from the first image.
      // This happens when you navigate over the last image to return to the first one
      if (getIndex(prev, this.images) === this.images.length - 1 && getIndex(current, this.images) === 0) {
        // first image
        this.setBeginningIndexesPreviews();
        this.previews = this.images.filter((img: InternalLibImage, i: number) => i >= this.start && i < this.end);
        return;
      }
      // the same for the opposite case, when you navigate back from the fist image to go to the last one.
      if (getIndex(prev, this.images) === 0 && getIndex(current, this.images) === this.images.length - 1) {
        // last image
        this.setEndIndexesPreviews();
        this.previews = this.images.filter((img: InternalLibImage, i: number) => i >= this.start && i < this.end);
        return;
      }

      // otherwise manage standard scenarios
      if (getIndex(prev, this.images) > getIndex(current, this.images)) {
        this.previous();
      } else if (getIndex(prev, this.images) < getIndex(current, this.images)) {
        this.next();
      }
    }
  }

  /**
   * Method called by events from both keyboard and mouse on a preview.
   * This will trigger the `clickpreview` output with the input preview as its payload.
   * @param {InternalLibImage} preview that triggered this method
   * @param {KeyboardEvent | MouseEvent} event payload
   */
  onImageEvent(preview: InternalLibImage, event: KeyboardEvent | MouseEvent) {
    if (!this.configPreview || !this.configPreview.clickable) {
      return;
    }
    const result: number = super.handleImageEvent(event);
    if (result === NEXT) {
      this.clickPreview.emit(preview);
    } else if (result === PREV) {
      this.clickPreview.emit(preview);
    }
  }

  /**
   * Method called by events from both keyboard and mouse on a navigation arrow.
   * @param {string} direction of the navigation that can be either 'next' or 'prev'
   * @param {KeyboardEvent | MouseEvent} event payload
   */
  onNavigationEvent(direction: string, event: KeyboardEvent | MouseEvent) {
    const result: number = super.handleNavigationEvent(direction, event);
    if (result === NEXT) {
      this.next();
    } else if (result === PREV) {
      this.previous();
    }
  }

  /**
   * Method used in the template to track ids in ngFor.
   * @param {number} index of the array
   * @param {Image} item of the array
   * @returns {number} the id of the item
   */
  trackById(index: number, item: Image): number {
    return item.id;
  }

  /**
   * Private method to init both `start` and `end` to the beginning.
   */
  private setBeginningIndexesPreviews() {
    this.start = 0;
    this.end = Math.min(<number>this.configPreview.number, this.images.length);
  }

  /**
   * Private method to init both `start` and `end` to the end.
   */
  private setEndIndexesPreviews() {
    this.start = this.images.length - 1 - (<number>this.configPreview.number - 1);
    this.end = this.images.length;
  }

  /**
   * Private method to update both `start` and `end` based on the currentImage.
   */
  private setIndexesPreviews() {
    this.start = getIndex(this.currentImage, this.images) - Math.floor(<number>this.configPreview.number / 2);
    this.end = getIndex(this.currentImage, this.images) + Math.floor(<number>this.configPreview.number / 2) + 1;
  }

  /**
   * Private method to update the visible previews navigating to the right (next).
   */
  private next() {
    // check if nextImage should be blocked
    if (this.isPreventSliding(this.images.length - 1)) {
      return;
    }

    if (this.end === this.images.length) {
      return;
    }

    this.start++;
    this.end = Math.min(this.end + 1, this.images.length);

    this.previews = this.images.filter((img: InternalLibImage, i: number) => i >= this.start && i < this.end);
  }

  /**
   * Private method to update the visible previews navigating to the left (previous).
   */
  private previous() {
    // check if prevImage should be blocked
    if (this.isPreventSliding(0)) {
      return;
    }

    if (this.start === 0) {
      return;
    }

    this.start = Math.max(this.start - 1, 0);
    this.end = Math.min(this.end - 1, this.images.length);

    this.previews = this.images.filter((img: InternalLibImage, i: number) => i >= this.start && i < this.end);
  }

  /**
   * Private method to block/permit sliding between previews.
   * @param {number} boundaryIndex is the first or the last index of `images` input array
   * @returns {boolean} if true block sliding, otherwise not
   */
  private isPreventSliding(boundaryIndex: number): boolean {
    return !!this.slideConfig && this.slideConfig.infinite === false && getIndex(this.currentImage, this.previews) === boundaryIndex;
  }
}
