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

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InternalLibImage } from '../modal-gallery/modal-gallery.component';
import { Image } from '../../interfaces/image.class';
import { AccessibilityConfig } from '../../interfaces/accessibility.interface';
import { DotsConfig } from '../../interfaces/dots-config.interface';
import { AccessibleComponent } from '../accessible.component';
import { NEXT } from '../../utils/user-input.util';

/**
 * Component with clickable dots (small circles) to navigate between images inside the modal gallery.
 */
@Component({
  selector: 'ks-dots',
  styleUrls: ['dots.scss'],
  templateUrl: 'dots.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DotsComponent extends AccessibleComponent implements OnInit {
  /**
   * Input of type `InternalLibImage` that represent the currently visible image.
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
   * Input of type `DotsConfig` to init DotsComponent's features.
   * For instance, it contains a param to show/hide this component.
   */
  @Input() dotsConfig: DotsConfig = {visible: true};
  /**
   * Input of type `AccessibilityConfig` to init custom accessibility features.
   * For instance, it contains titles, alt texts, aria-labels and so on.
   */
  @Input() accessibilityConfig: AccessibilityConfig;
  /**
   * Output to emit clicks over dots. The payload contains a number that represent
   * the index of the clicked dot.
   */
  @Output() clickDot: EventEmitter<number> = new EventEmitter<number>();

  /**
   * Object of type `DotsConfig` exposed to the template. This field is initialized
   * applying transformations, default values and so on to the input of the same type.
   */
  configDots: DotsConfig;

  /**
   * Method ´ngOnInit´ to build `configDots` applying a default value.
   * This is an Angular's lifecycle hook, so its called automatically by Angular itself.
   * In particular, it's called only one time!!!
   */
  ngOnInit() {
    const defaultConfig: DotsConfig = {visible: true};
    this.configDots = Object.assign(defaultConfig, this.dotsConfig);
  }

  /**
   * Method to check if an image is active (i.e. the current image).
   * @param {number} index of the image to check if it's active or not
   * @returns {boolean} true if is active, false otherwise
   */
  isActive(index: number): boolean {
    return index === this.getImageIndex();
  }

  /**
   * Method to get the index of an image.
   * @param {Image} image to get the index, or the currently visible image, if not passed
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
   * Method called by events from keyboard and mouse.
   * @param {number} index of the dot
   * @param {KeyboardEvent | MouseEvent} event payload
   */
  onDotEvent(index: number, event: KeyboardEvent | MouseEvent) {
    const result: number = super.handleImageEvent(event);
    if (result === NEXT) {
      this.clickDot.emit(index);
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

}
