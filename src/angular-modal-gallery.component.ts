/*
 The MIT License (MIT)

 Copyright (c) 2017 Stefano Cappa (Ks89)
 Copyright (c) 2016 vimalavinisha

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
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

import {OnInit, Input, Output, EventEmitter, HostListener, Component} from '@angular/core';

export enum Action {
  NORMAL, // default value
  KEYBOARD,
  SWIPE
}

export class ImageModalEvent {
  action: Action;
  result: number | boolean;
  constructor(action: Action, result: number | boolean) {
    this.action = action;
    this.result = result;
  }
}

export class Image {
  thumb: string;
  img: string;
  description: string;
  constructor(thumb: string, img: string, description: string) {
    this.thumb = thumb;
    this.img = img;
    this.description = description;
  }
}

@Component({
  selector: 'imageModal',
  exportAs: 'imageModal',
  template: `
    <div class="ng-gallery" *ngIf="showRepeat">
      <div *ngFor="let i of modalImages; let index = index">
        <img src="{{ i.thumb }}" class="ng-thumb" (click)="openGallery(index)" alt="{{ i.description }}"/>
      </div>
    </div>
    <div class="ng-overlay" *ngIf="opened">
      <div class="ng-gallery-content">
        <div class="uil-ring-css" *ngIf="loading">
          <div></div>
        </div>
        <a class="close-popup" (click)="closeGallery()"><i class="fa fa-close"></i></a>
        <a class="nav-left" *ngIf="modalImages.length >1" (click)="prevImage()"><i class="fa fa-angle-left"></i></a>
        <img *ngIf="!loading" src="{{ imgSrc }}" (click)="nextImage()" class="effect" (swipeleft)="swipe(currentImageIndex, $event.type)" (swiperight)="swipe(currentImageIndex, $event.type)"/>
        <a class="nav-right" *ngIf="modalImages.length >1" (click)="nextImage()"><i class="fa fa-angle-right"></i></a>
        <span class="info-text">{{ currentImageIndex + 1 }}/{{ modalImages.length
          }} - {{ modalImages[currentImageIndex].description }}</span>
      </div>
    </div>
  `
})
export class AngularModalGallery implements OnInit {
  opened: boolean = false;
  loading: boolean = false;
  showRepeat: boolean = false;
  currentImageIndex: number = 0;
  imgSrc: string;

  private SWIPE_ACTION = {
    LEFT: 'swipeleft',
    RIGHT: 'swiperight'
  };

  private KEYBOARD = {
    ESC: 27,
    LEFT_ARROW: 37,
    RIGHT_ARROW: 39
  };

  @Input() modalImages: Image[];
  @Input() imagePointer: number;

  @Output() isClosed = new EventEmitter<ImageModalEvent>();
  @Output() visibleIndex = new EventEmitter<ImageModalEvent>();
  @Output() isFirstImage = new EventEmitter<ImageModalEvent>();
  @Output() isLastImage = new EventEmitter<ImageModalEvent>();

  @HostListener('window:keydown', ['$event']) onKeyDown(e: KeyboardEvent) {
    if (!this.opened) {
      return;
    }
    switch (e.keyCode) {
      case this.KEYBOARD.ESC:
        this.closeGallery(Action.KEYBOARD);
        break;
      case this.KEYBOARD.RIGHT_ARROW:
        this.nextImage(Action.KEYBOARD);
        break;
      case this.KEYBOARD.LEFT_ARROW:
        this.prevImage(Action.KEYBOARD);
        break;
    }
  }

  ngOnInit() {
    this.loading = true;
    if (this.imagePointer >= 0) {
      this.showRepeat = false;
      this.openGallery(this.imagePointer);
    } else {
      this.showRepeat = true;
    }
  }

  // hammerjs touch gestures support
  swipe(index: number, action = this.SWIPE_ACTION.RIGHT) {
    if (action === this.SWIPE_ACTION.RIGHT) {
      this.nextImage(Action.SWIPE);
    }
    if (action === this.SWIPE_ACTION.LEFT) {
      this.prevImage(Action.SWIPE);
    }
  }

  closeGallery(action: Action = Action.NORMAL) {
    this.opened = false;
    this.isClosed.emit(new ImageModalEvent(action, true));
  }

  prevImage(action: Action = Action.NORMAL) {
    this.loading = true;
    this.currentImageIndex = this.prevIndex(action, this.currentImageIndex);
    this.openGallery(this.currentImageIndex);
  }

  nextImage(action: Action = Action.NORMAL) {
    this.loading = true;
    this.currentImageIndex = this.nextIndex(action, this.currentImageIndex);
    this.openGallery(this.currentImageIndex);
  }

  openGallery(index: number) {
    this.currentImageIndex = index;
    this.opened = true;
    this.imgSrc = this.modalImages[this.currentImageIndex].img;
    this.loading = false;
  }

  private nextIndex(action: Action, index: number) {
    //example with modalImages.length == 3 (3 images in your gallery)
    //index index++ result
    // -2     -1      -1
    // -1     0       0
    //  0     1       1
    //  1     2       2
    //  2     3       0
    //  3     4       4
    //  4     5       5
    //  5     6       6
    //  6     7       7
    index++;
    if (this.modalImages.length === index) {
      // at the end of the gallery, so restart from the beginning (nextIndex => 0)
      this.isLastImage.emit(new ImageModalEvent(action, true));
      index = 0;
    }
    this.visibleIndex.emit(new ImageModalEvent(action, index));
    return index;
  }

  private prevIndex(action: Action, index: number) {
    //example with modalImages.length == 3 (3 images in your gallery)
    //index index-- result
    // -2      -3     2
    // -1      -2     2
    //  0      -1     2
    //  1      0      0
    //  2      1      1
    //  3      2      2
    //  4      3      3
    //  5      4      4
    //  6      5      5
    index--;
    if(index === 0) {
      this.isFirstImage.emit(new ImageModalEvent(action, true));
    } else if (index < 0) {
      index = this.modalImages.length - 1;
    }
    this.visibleIndex.emit(new ImageModalEvent(action, index));
    return index;
  }
}
