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

import { Input, Output, EventEmitter, Component } from '@angular/core';
import { Image } from './modal-gallery.component';

/**
 * Component with the gallery of thumbs.
 * In receives an array of Images and a boolean to show/hide
 * the gallery (feature used by imagePointer).
 * Also it emits click events as outputs.
 */
@Component({
  selector: 'gallery',
  styleUrls: ['gallery.scss'],
  templateUrl: 'gallery.html'
})
export class GalleryComponent {

  @Input() images: Image[];
  @Input() showGallery: boolean;

  @Output() show: EventEmitter<number> = new EventEmitter<number>();

  showModalGallery(index: number) {
    this.show.emit(index);
  }

  /**
   * Method to get `alt attribute`.
   * `alt` specifies an alternate text for an image, if the image cannot be displayed.
   * There is a similar version of this method into `modal-gallery.component.ts` that
   * receives an Image as input.
   * @param index Number that represents the image index.
   */
  getAltDescriptionByIndex(index: number) {
    if (!this.images) {
      return '';
    }
    if (!this.images[index] || !this.images[index].description) {
      return `Image ${index}`;
    }
    return this.images[index].description;
  }
}
