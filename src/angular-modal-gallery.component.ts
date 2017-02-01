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
  CLICK, // mouse click
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
        <img *ngIf="!loading" src="{{ imgSrc }}" (click)="nextImage(clickAction)" class="effect" (swipeleft)="swipe(currentImageIndex, $event.type)" (swiperight)="swipe(currentImageIndex, $event.type)"/>
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
  imgSrc: string;

  // enum action used to pass a click action
  // when you clicks over the modal image.
  // Declared here  to use it in the template.
  clickAction: Action = Action.CLICK;

  currentImageIndex: number = 0;

  private SWIPE_ACTION = {
    LEFT: 'swipeleft',
    RIGHT: 'swiperight',
    UP: 'swipeup',
    DOWN: 'swipedown'
  };

  private KEYBOARD = {
    ESC: 27,
    LEFT_ARROW: 37,
    RIGHT_ARROW: 39,
    UP_ARROW: 38,
    DOWN_ARROW: 40
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
    switch(action) {
      case this.SWIPE_ACTION.RIGHT:
        this.nextImage(Action.SWIPE);
        break;
      case this.SWIPE_ACTION.LEFT:
        this.prevImage(Action.SWIPE);
        break;
      // case this.SWIPE_ACTION.UP:
      //   break;
      // case this.SWIPE_ACTION.DOWN:
      //   break;
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

  private nextIndex(action: Action, currentIndex: number) {
    let nextIndex: number = 0;
    if(currentIndex >= 0 && currentIndex < this.modalImages.length - 1) {
      nextIndex = currentIndex + 1;
    } else {
      nextIndex = 0; // start from the first index
    }

    // emit first/last event based on nextIndex value
    this.emitBoundaryEvent(action, nextIndex);

    // emit current visibile image index
    this.visibleIndex.emit(new ImageModalEvent(action, nextIndex));

    return nextIndex;
  }

  private prevIndex(action: Action, currentIndex: number) {
    let nextIndex: number = 0;
    if(currentIndex > 0 && currentIndex <= this.modalImages.length - 1) {
      nextIndex = currentIndex - 1;
    } else {
      nextIndex = this.modalImages.length - 1; // start from the last index
    }

    // emit first/last event based on nextIndex value
    this.emitBoundaryEvent(action, nextIndex);

    // emit current visibile image index
    this.visibleIndex.emit(new ImageModalEvent(action, nextIndex));

    return nextIndex;
  }

  private emitBoundaryEvent(action: Action, indexToCheck: number) {
    // to emit first/last event
    switch(indexToCheck) {
      case 0:
        this.isFirstImage.emit(new ImageModalEvent(action, true));
        break;
      case this.modalImages.length - 1:
        this.isLastImage.emit(new ImageModalEvent(action, true));
        break;
    }
  }
}
