/*
 The MIT License (MIT)

 Copyright (C) 2017-2021 Stefano Cappa (Ks89)

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

import { OverlayRef } from '@angular/cdk/overlay';

import { Subject } from 'rxjs';
import { ImageModalEvent } from '../../model/image.class';
import { ButtonEvent } from '../../model/buttons-config.interface';

export class ModalGalleryRef {
  private close = new Subject<ImageModalEvent>();
  close$ = this.close.asObservable();
  private show = new Subject<ImageModalEvent>();
  show$ = this.show.asObservable();
  private firstImage = new Subject<ImageModalEvent>();
  firstImage$ = this.firstImage.asObservable();
  private lastImage = new Subject<ImageModalEvent>();
  lastImage$ = this.lastImage.asObservable();
  private hasData = new Subject<ImageModalEvent>();
  hasData$ = this.hasData.asObservable();
  private buttonBeforeHook = new Subject<ButtonEvent>();
  buttonBeforeHook$ = this.buttonBeforeHook.asObservable();
  private buttonAfterHook = new Subject<ButtonEvent>();
  buttonAfterHook$ = this.buttonAfterHook.asObservable();

  constructor(private overlayRef: OverlayRef) {}

  closeModal(): void {
    this.overlayRef.dispose();
  }

  emitClose(event: ImageModalEvent): void {
    this.close.next(event);
  }

  emitShow(event: ImageModalEvent): void {
    this.show.next(event);
  }

  emitFirstImage(event: ImageModalEvent): void {
    this.firstImage.next(event);
  }

  emitLastImage(event: ImageModalEvent): void {
    this.lastImage.next(event);
  }

  emitHasData(event: ImageModalEvent): void {
    this.hasData.next(event);
  }

  emitButtonBeforeHook(event: ButtonEvent): void {
    this.buttonBeforeHook.next(event);
  }

  emitButtonAfterHook(event: ButtonEvent): void {
    this.buttonAfterHook.next(event);
  }
}
