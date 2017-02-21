/*
 The MIT License (MIT)

 Copyright (c) 2017 Stefano Cappa (Ks89)
 Copyright (c) 2016 vimalavinisha (only for version 1)

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

import {OnInit, Input, Output, EventEmitter, HostListener, Component, OnDestroy} from '@angular/core';
import {Observable, Subscription} from "rxjs";

import 'mousetrap';

export enum Action {
  NORMAL, // default value
  CLICK, // mouse click
  KEYBOARD,
  SWIPE,
  LOAD
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
  img: string;
  thumb?: string;
  description?: string;
  extUrl?: string;

  constructor(img: string, thumb?: string, description?: string, extUrl?: string) {
    this.img = img;
    this.thumb = thumb;
    this.description = description;
    this.extUrl = extUrl;
  }
}

export enum Keyboard {
  ESC = 27,
  LEFT_ARROW = 37,
  RIGHT_ARROW = 39,
  UP_ARROW = 38,
  DOWN_ARROW = 40
}

export interface Description {
  customFullDescription?: string;
  imageText?: string;
  numberSeparator?: string;
  beforeTextDescription?: string;
}

@Component({
  selector: 'modalGallery',
  exportAs: 'modalGallery',
  styleUrls: ['modal-gallery.scss'],
  templateUrl: 'modal-gallery.html'
})
export class AngularModalGallery implements OnInit, OnDestroy {
  opened: boolean = false;
  loading: boolean = false;
  showGallery: boolean = false;

  images: Image[];
  currentImage: Image;
  currentImageIndex: number = 0;

  // enum action used to pass a click action
  // when you clicks over the modal image.
  // Declared here  to use it in the template.
  clickAction: Action = Action.CLICK;

  private SWIPE_ACTION = {
    LEFT: 'swipeleft',
    RIGHT: 'swiperight',
    UP: 'swipeup',
    DOWN: 'swipedown'
  };

  private mousetrap: MousetrapInstance;
  private subscription: Subscription;

  @Input() modalImages: Observable<Array<Image>> | Array<Image>;
  @Input() imagePointer: number;
  @Input() showDownloadButton: boolean = false;
  @Input() showExtUrlButton: boolean = false;
  @Input() downloadable: boolean = false;
  @Input() description: Description;

  @Output() close = new EventEmitter<ImageModalEvent>();
  @Output() show = new EventEmitter<ImageModalEvent>();
  @Output() firstImage = new EventEmitter<ImageModalEvent>();
  @Output() lastImage = new EventEmitter<ImageModalEvent>();
  @Output() hasData = new EventEmitter<ImageModalEvent>();

  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (!this.opened) {
      return;
    }
    switch (e.keyCode) {
      case Keyboard.ESC:
        this.closeGallery(Action.KEYBOARD);
        break;
      case Keyboard.RIGHT_ARROW:
        this.nextImage(Action.KEYBOARD);
        break;
      case Keyboard.LEFT_ARROW:
        this.prevImage(Action.KEYBOARD);
        break;
    }
  }

  constructor() {
    // mousetrap is a library to catch keyboard's shortcuts
    this.mousetrap = new (<any>Mousetrap)();

    // if description isn't provided initialize it with a default object
    if(!this.description) {
      this.description = {
        imageText: 'Image ',
        numberSeparator: '/',
        beforeTextDescription: ' - '
      }
    }

    // if one of the Description fields isn't initialized, provide a default value
    this.description.imageText = this.description.imageText || 'Image ';
    this.description.numberSeparator = this.description.numberSeparator || '/';
    this.description.beforeTextDescription = this.description.beforeTextDescription || ' - ';
  }

  ngOnInit() {
    // required before showModalGallery, otherwise this.images will be undefined
    this.initImages();

    this.loading = true;
    if (this.imagePointer >= 0) {
      this.showGallery = false;
      this.showModalGallery(this.imagePointer);
    } else {
      this.showGallery = true;
    }
  }

  private initImages() {
    if (this.modalImages instanceof Array) {
      this.images = this.modalImages;
      this.hasData.emit(new ImageModalEvent(Action.LOAD, true));
    } else {
      this.subscription = this.modalImages.subscribe((val: Array<Image>) => {
        this.images = val;
        this.hasData.emit(new ImageModalEvent(Action.LOAD, true));
      });
    }
  }

  getDescriptionToDisplay() {
    if(this.description && this.description.customFullDescription) {
      return this.description.customFullDescription;
    }
    // If the current image hasn't a description,
    // prevent to write the ' - ' (or this.description.beforeTextDescription)
    if(!this.currentImage.description || this.currentImage.description === '') {
      return `${this.description.imageText}${this.currentImageIndex + 1}${this.description.numberSeparator}${this.images.length}`;
    }
    return `${this.description.imageText}${this.currentImageIndex + 1}${this.description.numberSeparator}${this.images.length}${this.description.beforeTextDescription}${this.currentImage.description}`;
  }

  // hammerjs touch gestures support
  swipe(index: number, action = this.SWIPE_ACTION.RIGHT) {
    switch (action) {
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
    this.mousetrap.reset();
    this.close.emit(new ImageModalEvent(action, true));
  }

  prevImage(action: Action = Action.NORMAL) {
    this.loading = true;
    this.currentImageIndex = this.getPrevIndex(action, this.currentImageIndex);
    this.showModalGallery(this.currentImageIndex);
  }

  nextImage(action: Action = Action.NORMAL) {
    this.loading = true;
    this.currentImageIndex = this.getNextIndex(action, this.currentImageIndex);
    this.showModalGallery(this.currentImageIndex);
  }

  showModalGallery(index: number) {
    this.mousetrap.bind(['ctrl+s', 'meta+s'], (event: KeyboardEvent, combo: string) => {
      if (event.preventDefault) {
        event.preventDefault();
      } else {
        // internet explorer
        event.returnValue = false;
      }
      this.downloadImage();
    });

    this.currentImageIndex = index;
    this.opened = true;
    this.currentImage = this.images[this.currentImageIndex];
    this.loading = false;

    // emit current visible image index
    this.show.emit(new ImageModalEvent(Action.LOAD, this.currentImageIndex + 1));
  }

  downloadImage() {
    if (!this.downloadable) {
      return;
    }
    if (navigator.msSaveBlob) {
      // IE11 & Edge
      // TODO FIXME implement this
      // navigator.msSaveBlob(csvData, this.getFileName(this.currentImage.img));
    } else {
      // other browsers
      let link = document.createElement('a');
      link.href = this.currentImage.img;
      link.setAttribute('download', this.getFileName(this.currentImage.img));
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // apply [style.right]="" to external url <a></a>
  getExtUrlRightPx() {
    return this.showExtUrlButton ? '63px' : '0px';
  }
  // apply [style.right]="" to download url <a></a>
  getDownloadRightPx(currentImageExtUrl: string) {
    if(this.showDownloadButton) {
      if (this.showExtUrlButton && currentImageExtUrl) {
        return '126px';
      } else {
        return '63px';
      }
    } else {
      return '0px';
    }
  }

  private getNextIndex(action: Action, currentIndex: number): number {
    let newIndex: number = 0;
    if (currentIndex >= 0 && currentIndex < this.images.length - 1) {
      newIndex = currentIndex + 1;
    } else {
      newIndex = 0; // start from the first index
    }

    // emit first/last event based on newIndex value
    this.emitBoundaryEvent(action, newIndex);

    // emit current visible image index
    this.show.emit(new ImageModalEvent(action, newIndex));

    return newIndex;
  }

  private getPrevIndex(action: Action, currentIndex: number): number {
    let newIndex: number = 0;
    if (currentIndex > 0 && currentIndex <= this.images.length - 1) {
      newIndex = currentIndex - 1;
    } else {
      newIndex = this.images.length - 1; // start from the last index
    }

    // emit first/last event based on newIndex value
    this.emitBoundaryEvent(action, newIndex);

    // emit current visible image index
    this.show.emit(new ImageModalEvent(action, newIndex));

    return newIndex;
  }

  private emitBoundaryEvent(action: Action, indexToCheck: number) {
    // to emit first/last event
    switch (indexToCheck) {
      case 0:
        this.firstImage.emit(new ImageModalEvent(action, true));
        break;
      case this.images.length - 1:
        this.lastImage.emit(new ImageModalEvent(action, true));
        break;
    }
  }

  private getFileName(path: string) {
    return path.replace(/^.*[\\\/]/, '');
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.mousetrap.reset();
  }
}
