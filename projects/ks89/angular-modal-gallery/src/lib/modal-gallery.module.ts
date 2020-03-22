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

import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DIRECTIVES } from './directives/directives';
import { COMPONENTS, CarouselComponent } from './components/components';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import { OverlayModule } from '@angular/cdk/overlay';
import { ConfigService } from './services/config.service';
import { PlainGalleryComponent } from './components/plain-gallery/plain-gallery.component';

// to prevent bad scrolling behaviour on mobile phone with carousels.
// From @mohaxspb (https://github.com/Ks89/angular-modal-gallery/pull/187)
@Injectable()
export class KsHammerGestureConfig extends HammerGestureConfig {
  buildHammer(element: HTMLElement) {
    return new Hammer(element, {
      touchAction: 'pan-y'
    });
  }
}

/**
 * Module to import it in the root module of your application.
 */
@NgModule({
  imports: [CommonModule, OverlayModule],
  declarations: [COMPONENTS, DIRECTIVES],
  exports: [PlainGalleryComponent, CarouselComponent],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: KsHammerGestureConfig
    },
    ConfigService
  ]
})
export class GalleryModule {}
