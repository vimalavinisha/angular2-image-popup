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
import { Image } from '../../interfaces/image.class';
import { GridLayout, LineLayout, PlainGalleryConfig, PlainGalleryStrategy } from '../../interfaces/plain-gallery-config.interface';

/**
 * Component with the gallery of thumbs.
 * In receives an array of Images and a boolean to show/hide
 * the gallery (feature used by imagePointer).
 * Also it emits click events as outputs.
 */
@Component({
  selector: 'ks-gallery',
  styleUrls: ['gallery.scss'],
  templateUrl: 'gallery.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryComponent implements OnInit {

  @Input() images: Image[];
  @Input() showGallery: boolean;
  @Input() plainGalleryConfig: PlainGalleryConfig;

  @Output() show: EventEmitter<number> = new EventEmitter<number>();

  configPlainGallery: PlainGalleryConfig;

  imageGrid: Image[][] = [];

  // length=-1 means infinity
  private defaultLayout: LineLayout = new LineLayout({length: -1, iconClass: '', otherCount: 2}, false);

  private defaultPlainConfig: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.ROW,
    layout: this.defaultLayout,
    size: {
      width: 50,
      height: 50,
      unit: 'px'
    }
  };

  ngOnInit() {
    const config: PlainGalleryConfig = Object.assign({}, this.defaultPlainConfig, this.plainGalleryConfig);
    console.log('plainGalleryConfig config', config);

    if (config.layout instanceof LineLayout) {
      if (config.strategy !== PlainGalleryStrategy.ROW && config.strategy !== PlainGalleryStrategy.COLUMN) {
        throw new Error('LineLayout requires strategy: ROW or COLUMN');
      }

      if (!config.layout.breakConfig) {
        throw new Error('breakConfig must be valid');
      }

      const row: Image[] = this.images.filter((val: Image, i: number) => i < config.layout.breakConfig.length || config.layout.breakConfig.length === -1);
      this.imageGrid = [row];
    }

    if (config.layout instanceof GridLayout) {
      if (config.strategy !== PlainGalleryStrategy.GRID && config.strategy !== PlainGalleryStrategy.ADVANCED_GRID) {
        throw new Error('GridLayout requires strategy: GRID or ADVANCED_GRID');
      }

      const count: number = Math.ceil(this.images.length / config.layout.breakConfig.length);
      let start = 0;
      let end: number = config.layout.breakConfig.length - 1;

      for (let j = 0; j < count; j++) {
        const row: Image[] = this.images.filter((val: Image, i: number) => i >= start && i <= end);
        this.imageGrid.push(row);
        start = end + 1;
        end = end + config.layout.breakConfig.length - 1;
      }

    }

    this.configPlainGallery = config;

    console.log('this.imageGrid', this.imageGrid);
  }

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

  trackById(index: number, item: Image) {
    return item.id;
  }
}
