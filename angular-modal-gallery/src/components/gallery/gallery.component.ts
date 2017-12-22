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

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { Image } from '../../interfaces/image.class';
import { AdvancedLayout, GridLayout, LineLayout, PlainGalleryConfig, PlainGalleryStrategy } from '../../interfaces/plain-gallery-config.interface';
import { Size } from '../../interfaces/size.interface';

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
export class GalleryComponent implements OnInit, OnChanges {

  @Input() images: Image[];
  @Input() showGallery: boolean;
  @Input() plainGalleryConfig: PlainGalleryConfig;

  @Output() show: EventEmitter<number> = new EventEmitter<number>();

  configPlainGallery: PlainGalleryConfig;

  imageGrid: Image[][] = [];

  size: Size;
  wrapStyle = false;
  widthStyle = '';
  directionStyle: string;
  justifyStyle: string;

  private defaultSize: Size = {width: '50px', height: 'auto'};

  // length=-1 means infinity
  private defaultLayout: LineLayout = new LineLayout(this.defaultSize, {length: -1, wrap: false}, 'flex-start');

  private defaultPlainConfig: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.ROW,
    layout: this.defaultLayout,
    advanced: {aTags: false}
  };

  ngOnInit() {
    this.configPlainGallery = this.initPlainGalleryConfig();
    this.initImageGrid();
  }

  /**
   * Method ´ngOnChanges´ to update `imageGrid`, `configPlainGallery` and other stuff.
   * This is an Angular's lifecycle hook, so its called automatically by Angular itself.
   * In particular, it's called when any data-bound property of a directive changes!!!
   */
  ngOnChanges(changes: SimpleChanges) {
    const imagesChange: SimpleChange = changes.images;
    const configChange: SimpleChange = changes.plainGalleryConfig;

    // console.log('gallery ngOnChanges called with configChange', configChange);

    // I'm using !change.firstChange because the first time will be called both onInit and onChange and I don't
    // want to execute initialization two times.
    if (configChange && !configChange.firstChange &&
      (configChange.previousValue !== configChange.currentValue || (!configChange.previousValue && !configChange.currentValue))) {
      // console.log('initializing plain gallery');
      this.configPlainGallery = this.initPlainGalleryConfig();
    }
    if (imagesChange && !imagesChange.firstChange && imagesChange.previousValue !== imagesChange.currentValue) {
      // console.log('initializing imageGrid');
      this.initImageGrid();
    }
    // console.log('gallery ngOnChanges finished');
  }

  private initPlainGalleryConfig() {
    const config: PlainGalleryConfig = Object.assign({}, this.defaultPlainConfig, this.plainGalleryConfig);

    if (config.layout instanceof LineLayout) {
      if (config.strategy !== PlainGalleryStrategy.ROW && config.strategy !== PlainGalleryStrategy.COLUMN) {
        throw new Error('LineLayout requires either ROW or COLUMN strategy');
      }
      if (!config.layout || !config.layout.breakConfig) {
        throw new Error('Both layout and breakConfig must be valid');
      }
    }

    if (config.layout instanceof GridLayout) {
      if (config.strategy !== PlainGalleryStrategy.GRID) {
        throw new Error('GridLayout requires GRID strategy');
      }
      if (!config.layout || !config.layout.breakConfig) {
        throw new Error('Both layout and breakConfig must be valid');
      }
      // force wrap for grid layout
      config.layout.breakConfig.wrap = true;
    }

    if (config.layout instanceof AdvancedLayout) {
      if (config.strategy !== PlainGalleryStrategy.CUSTOM) {
        throw new Error('AdvancedLayout requires CUSTOM strategy');
      }
    }

    return config;
  }

  private initImageGrid() {
    const config: PlainGalleryConfig = this.configPlainGallery;

    // reset the array to prevent issues in case of GridLayout
    this.imageGrid = [];

    if (config.layout instanceof LineLayout) {
      const layout: LineLayout = config.layout;
      const row: Image[] = this.images.filter((val: Image, i: number) => i < layout.breakConfig.length || layout.breakConfig.length === -1);
      this.imageGrid = [row];

      this.size = config.layout.size;

      switch (config.strategy) {
        case PlainGalleryStrategy.ROW:
          this.directionStyle = 'row';
          break;
        case PlainGalleryStrategy.COLUMN:
          this.directionStyle = 'column';
          this.wrapStyle = layout.breakConfig.wrap;
          break;
      }
      this.justifyStyle = layout.justify;
    }

    if (config.layout instanceof GridLayout) {
      const layout: GridLayout = config.layout;
      const count: number = Math.ceil(this.images.length / layout.breakConfig.length);
      let start = 0;
      let end: number = layout.breakConfig.length - 1;

      for (let j = 0; j < count; j++) {
        const row: Image[] = this.images.filter((val: Image, i: number) => i >= start && i <= end);
        this.imageGrid.push(row);
        start = end + 1;
        end = start + layout.breakConfig.length - 1;
      }

      this.size = config.layout.size;

      const pixels: number = +(layout.size.width.replace('px', ''));

      this.widthStyle = ((pixels * layout.breakConfig.length) + (pixels / 2)) + 'px';
      this.wrapStyle = layout.breakConfig.wrap;

      this.directionStyle = 'row';
    }

    if (config.layout instanceof AdvancedLayout) {
      this.imageGrid = [this.images];
    }
  }

  showModalGallery(index: number) {
    this.show.emit(index);
  }

  showModalGalleryByImage(img: Image) {
    const index: number = this.images.findIndex((val: Image) => val.id === img.id);
    this.showModalGallery(index);
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

    const image: Image = this.images[index];
    if (!image || !image.modal || !image.modal.description) {
      return `Image ${index}`;
    }
    return image.modal.description;
  }

  trackById(index: number, item: Image) {
    return item.id;
  }
}
