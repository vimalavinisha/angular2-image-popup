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
import { InternalLibImage } from '../modal-gallery/modal-gallery.component';
import { Image } from '../../interfaces/image.class';
import { PreviewConfig } from '../../interfaces/preview-config.interface';
import { SlideConfig } from '../../interfaces/slide-config.interface';
import { AccessibilityConfig } from '../../interfaces/accessibility.interface';
import { ImageSize } from '../../interfaces/image-size.interface';
import { AccessibleComponent } from '../accessible.component';
import { PREV, NEXT } from '../../utils/user-input.util';

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

  @Input() currentImage: InternalLibImage;

  /**
   * Array of `Image` that represent the model of this library with all images, thumbs and so on.
   */
  @Input() images: InternalLibImage[];

  @Input() isOpen: boolean;

  @Input() slideConfig: SlideConfig;

  @Input() previewConfig: PreviewConfig;

  @Input() accessibilityConfig: AccessibilityConfig;

  @Output() clickPreview: EventEmitter<InternalLibImage> = new EventEmitter<InternalLibImage>();

  previews: InternalLibImage[] = [];

  configPreview: PreviewConfig;

  start: number;
  end: number;

  private defaultPreviewSize: ImageSize = {height: 90, width: 90, unit: 'px'};

  private defaultPreviewConfig: PreviewConfig = {
    visible: true,
    number: 3,
    arrows: true,
    clickable: true,
    alwaysCenter: false,
    size: this.defaultPreviewSize
  };

  ngOnInit() {
    this.configPreview = Object.freeze(Object.assign(this.defaultPreviewConfig, this.previewConfig));

    // I use <number> in front of this.configPreview.number below, because I know that
    // this.configPreview.number will be always defined thanks to the line above  Object.assign(...),
    // however I'm getting an error in my IDE so I decided to add this useless cast.

    if (this.getIndex(this.currentImage) === 0) {
      // first image
      this.start = 0;
      this.end = Math.min(<number>this.configPreview.number, this.images.length);
    } else if (this.getIndex(this.currentImage) === this.images.length - 1) {
      // last image
      this.start = (this.images.length - 1) - (<number>this.configPreview.number - 1);
      this.end = this.images.length;
    } else {
      // other images
      this.start = this.getIndex(this.currentImage) - Math.floor(<number>this.configPreview.number / 2);
      this.end = this.getIndex(this.currentImage) + Math.floor(<number>this.configPreview.number / 2) + 1;
    }
    this.previews = this.images.filter((img: InternalLibImage, i: number) => i >= this.start && i < this.end);
  }

  isActive(preview: InternalLibImage) {
    // FIXME add null checks
    return preview.id === this.currentImage.id;
  }

  ngOnChanges(changes: SimpleChanges) {
    const simpleChange: SimpleChange = changes.currentImage;
    if (!simpleChange) {
      return;
    }
    const prev: InternalLibImage = simpleChange.previousValue;
    const current: InternalLibImage = simpleChange.currentValue;

    if (prev && current && prev.id !== current.id) {

      console.log('-prev ' + this.getIndex(prev));
      console.log('-current ' + this.getIndex(current));

      if (this.getIndex(prev) > this.getIndex(current)) {
        // called previous
        // if (this.getIndex(this.currentImage) === this.images.length - 1) {
        //   console.warn('ngChanges PREVENTING PREVIOUS');
        //   return;
        // }
        this.previous();
      } else if (this.getIndex(prev) < this.getIndex(current)) {
        // called next
        // if (this.getIndex(this.currentImage) === 0) {
        //   console.warn('ngChanges PREVENTING NEXT');
        //   return;
        // }
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

  onNavigationEvent(direction: string, event: KeyboardEvent | MouseEvent) {
    console.log('onEvent direction: ' + direction);
    console.log('onEvent event:', event);

    const result: number = super.handleNavigationEvent(direction, event);
    if (result === NEXT) {
      this.next();
    } else if (result === PREV) {
      this.previous();
    }
  }

  trackById(index: number, item: Image) {
    return item.id;
  }

  private next() {
    console.log('N next');

    console.log('N prevent? ' + this.isPreventSliding(this.images.length - 1));

    // check if nextImage should be blocked
    if (this.isPreventSliding(this.images.length - 1)) {
      console.log('N prevent sliding - returning');
      return;
    }

    console.log('N end ' + this.end + ' === length ' + this.images.length);

    if (this.end === this.images.length) {
      console.log('N end - returning');
      return;
    }

    console.log('N old start' + this.start);
    console.log('N old end' + this.end);

    this.start++;
    this.end = Math.min(this.end + 1, this.images.length);

    console.log('N new start' + this.start);
    console.log('N new end' + this.end);

    this.previews = this.images.filter((img: InternalLibImage, i: number) => i >= this.start && i < this.end);

    console.log('N previews', this.previews);
  }

  private previous() {

    console.log('P previous');

    console.log('P prevent? ' + this.isPreventSliding(0));

    // check if prevImage should be blocked
    if (this.isPreventSliding(0)) {
      console.log('P prevent sliding - returning');
      return;
    }

    console.log('P start ' + this.start + ' === 0');

    if (this.start === 0) {
      console.log('P start - returning');
      return;
    }

    console.log('P old start' + this.start);
    console.log('P old end' + this.end);

    this.start = Math.max(this.start - 1, 0);
    this.end = Math.min(this.end - 1, this.images.length);

    console.log('P new start' + this.start);
    console.log('P new end' + this.end);

    this.previews = this.images.filter((img: InternalLibImage, i: number) => i >= this.start && i < this.end);

    console.log('P previews', this.previews);
  }

  private isPreventSliding(boundaryIndex: number) {
    return !!this.slideConfig && this.slideConfig.infinite === false &&
      this.getIndex(this.currentImage, this.previews) === boundaryIndex;
  }
}
