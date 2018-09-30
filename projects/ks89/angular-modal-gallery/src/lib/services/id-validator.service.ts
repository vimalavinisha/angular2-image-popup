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

import { Injectable } from '@angular/core';

/**
 * Service to check if the provided id is unique
 */
@Injectable()
export class IdValidatorService {
  ids = new Map();

  checkAndAdd(galleryId: number | undefined): boolean {
    if (!Number.isInteger(galleryId) || galleryId < 0) {
      throw new Error('You must provide a valid [id]="unique integer > 0 here" to the gallery/carousel in your template');
    }
    if (this.ids.get(galleryId)) {
      throw new Error(`Cannot create gallery with id=${galleryId} because already used in your application. This must be a unique integer >= 0`);
    }
    this.ids.set(galleryId, galleryId);
    return true;
  }

  remove(galleryId: number | undefined): boolean {
    if (!Number.isInteger(galleryId) || galleryId < 0) {
      throw new Error('You must provide a valid [id]="unique integer > 0 here" to the gallery/carousel in your template');
    }
    // if (this.ids.find(id => id === galleryId)) {
    //   throw new Error(`Cannot create gallery with id=${galleryId} because already used in your application. This must be a unique number >= 0.`);
    // }
    this.ids.delete(galleryId);
    return true;
  }
}
