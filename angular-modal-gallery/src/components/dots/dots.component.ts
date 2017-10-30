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

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { InternalLibImage } from '../modal-gallery/modal-gallery.component';
import { Image } from '../../interfaces/image.class';

/**
 * Component with dots
 */
@Component({
  selector: 'ks-dots',
  styleUrls: ['dots.scss'],
  templateUrl: 'dots.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DotsComponent {

  @Input() currentImage: InternalLibImage;

  /**
   * Array of `Image` that represent the model of this library with all images, thumbs and so on.
   */
  @Input() images: InternalLibImage[];

  @Input() isOpen: boolean;

  @Output() clickDot: EventEmitter<number> = new EventEmitter<number>();

  isActive(index: number) {
    return index === this.getCurrentImageIndex(this.currentImage);
  }

  getCurrentImageIndex(image: Image) {
    // id is mandatory. You can use either numbers or strings.
    // If the id is 0, I shouldn't throw an error.
    if (!image || (!image.id && image.id !== 0)) {
      throw new Error(`Image 'id' is mandatory`);
    }
    return this.images.findIndex((val: Image) => val.id === image.id);
  }

  onClick(index: number) {
    this.clickDot.emit(index);
  }

  trackById(index: number, item: Image) {
    return item.id;
  }

}
