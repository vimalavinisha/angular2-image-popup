/*
 The MIT License (MIT)

 Copyright (c) 2017-2019 Stefano Cappa (Ks89)

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

import { EventEmitter, Injectable } from '@angular/core';
import { Image } from '../model/image.class';

export interface InternalGalleryPayload {
  galleryId: number;
  index?: number;
  image?: Image;
  result?: boolean;
}

/**
 * Service to call methods on a gallery by its galleryId.
 */
@Injectable({ providedIn: 'root' })
export class GalleryService {
  navigate: EventEmitter<InternalGalleryPayload> = new EventEmitter<InternalGalleryPayload>();
  close: EventEmitter<number> = new EventEmitter<number>();
  update: EventEmitter<InternalGalleryPayload> = new EventEmitter<InternalGalleryPayload>();
  autoPlay: EventEmitter<InternalGalleryPayload> = new EventEmitter<InternalGalleryPayload>();

  /**
   * Method to open the modal gallery with the galleryId passed as parameter.
   * It will automatically shows the image at position index.
   * @param galleryId number or undefined that represents the unique id of the gallery.
   * @param index number of the image that you want to open.
   * @throws a error with a message if galleryId is either undefined, < 0 or index is < 0
   */
  openGallery(galleryId: number | undefined, index: number): void {
    if (galleryId === undefined || galleryId < 0 || index < 0) {
      throw new Error('Cannot open gallery via GalleryService with either index<0 or galleryId<0 or galleryId===undefined');
    }
    this.navigate.emit({
      galleryId: galleryId,
      index: index
    });
  }

  /**
   * Method to navigate to a specific index of the modal gallery with the galleryId passed as parameter.
   * At the moment, it's like openGallery, but in upcoming releases it will change the behaviour.
   * @param galleryId number or undefined that represents the unique id of the gallery.
   * @param index number of the image that you want to open.
   * @throws a error with a message if galleryId is either undefined, < 0 or index is < 0
   */
  navigateGallery(galleryId: number | undefined, index: number): void {
    if (galleryId === undefined || galleryId < 0 || index < 0) {
      throw new Error('Cannot navigate via GalleryService with either index<0 or galleryId<0 or galleryId===undefined');
    }
    this.navigate.emit({
      galleryId: galleryId,
      index: index
    });
  }

  /**
   * Method to close the modal gallery with the galleryId passed as parameter.
   * @param galleryId number or undefined that represents the unique id of the gallery.
   * @throws a error with a message if galleryId is either undefined or < 0
   */
  closeGallery(galleryId: number | undefined): void {
    if (galleryId === undefined || galleryId < 0) {
      throw new Error('Cannot close gallery via GalleryService with galleryId<0 or galleryId===undefined');
    }
    this.close.emit(galleryId);
  }

  /**
   * Service to update an image with a new object
   * @param galleryId number or undefined that represents the unique id of the gallery.
   * @param index number of the image that you want to update.
   * @throws a error with a message if galleryId is either undefined, < 0 or index is < 0
   *
   * @since 6.3.0
   */
  updateGallery(galleryId: number | undefined, index: number, image: Image): void {
    if (galleryId === undefined || galleryId < 0 || index < 0) {
      throw new Error('Cannot update gallery via GalleryService with either index<0 or galleryId<0 or galleryId===undefined');
    }
    if (!image) {
      throw new Error('Cannot update gallery via GalleryService, because image is not valid');
    }
    this.update.emit({
      galleryId: galleryId,
      index: index,
      image: image
    });
  }

  /**
   * Service to play modal-gallery
   * @param galleryId number or undefined that represents the unique id of the gallery.
   * @throws a error with a message if galleryId is either undefined or < 0
   *
   * @since 7.2.0
   */
  play(galleryId: number | undefined): void {
    if (galleryId === undefined || galleryId < 0) {
      throw new Error('Cannot play gallery via GalleryService with galleryId<0 or galleryId===undefined');
    }
    this.autoPlay.emit({
      galleryId: galleryId,
      result: true
    });
  }

  /**
   * Service to stop modal-gallery
   * @param galleryId number or undefined that represents the unique id of the gallery.
   * @throws a error with a message if galleryId is either undefined or < 0
   *
   * @since 7.2.0
   */
  stop(galleryId: number | undefined): void {
    if (galleryId === undefined || galleryId < 0) {
      throw new Error('Cannot stop gallery via GalleryService with galleryId<0 or galleryId===undefined');
    }
    this.autoPlay.emit({
      galleryId: galleryId,
      result: false
    });
  }
}
