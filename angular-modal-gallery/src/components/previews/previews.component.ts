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

import {
  ChangeDetectionStrategy, Component, EventEmitter, Input,
  OnChanges, OnInit, Output, SimpleChange, SimpleChanges
} from '@angular/core';
import { InternalLibImage, SlideConfig } from '../modal-gallery/modal-gallery.component';
import { Image } from '../../interfaces/image.class';
import { PreviewConfig } from '../../interfaces/preview-config.interface';

/**
 * Component with image previews
 */
@Component({
  selector: 'ks-previews',
  styleUrls: ['previews.scss'],
  templateUrl: 'previews.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewsComponent implements OnInit, OnChanges {

  @Input() currentImage: InternalLibImage;

  /**
   * Array of `Image` that represent the model of this library with all images, thumbs and so on.
   */
  @Input() images: InternalLibImage[];

  @Input() isOpen: boolean;

  @Input() slideConfig: SlideConfig;

  @Input() previewConfig: PreviewConfig;

  @Output() clickPreview: EventEmitter<InternalLibImage> = new EventEmitter<InternalLibImage>();

  previews: InternalLibImage[] = [];

  start: number;
  end: number;

  ngOnInit() {
    this.previews = this.images.filter((img: InternalLibImage, i: number) => i < this.previewConfig.number);

    this.start = 0;
    this.end = Math.min(this.previewConfig.number, this.images.length);
  }

  isActive(index: number) {
    return index === this.getIndex(this.currentImage);
  }

  ngOnChanges(changes: SimpleChanges) {
    const simpleChange: SimpleChange = changes.currentImage;
    if (!simpleChange) {
      return;
    }
    const prev: InternalLibImage = simpleChange.previousValue;
    const current: InternalLibImage = simpleChange.currentValue;

    if (prev && current && prev.id !== current.id) {
      if (this.getIndex(prev, this.previews) > this.getIndex(current, this.previews)) {
        if (this.getIndex(this.currentImage) === this.images.length - 2) {
          return;
        }
        this.previous();
      } else if (this.getIndex(prev, this.previews) < this.getIndex(current, this.previews)) {
        if (this.getIndex(this.currentImage) === 1) {
          return;
        }
        this.next();
      }
    }
  }

  getIndex(image: Image, arrayOfImages: Image[] = this.images) {
    // id is mandatory. You can use either numbers or strings.
    // If the id is 0, I shouldn't throw an error.
    if (!image || (!image.id && image.id !== 0)) {
      throw new Error(`Image 'id' is mandatory`);
    }
    return arrayOfImages.findIndex((val: Image) => val.id === image.id);
  }

  onClick(preview: InternalLibImage) {
    if (!this.previewConfig || !this.previewConfig.clickable) {
      return;
    }
    this.clickPreview.emit(preview);
  }

  previous() {
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

  next() {
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

  trackById(index: number, item: Image) {
    return item.id;
  }

  private isPreventSliding(boundaryIndex: number) {
    return !!this.slideConfig && this.slideConfig.infinite === false &&
      this.getIndex(this.currentImage, this.previews) === boundaryIndex;
  }
}
