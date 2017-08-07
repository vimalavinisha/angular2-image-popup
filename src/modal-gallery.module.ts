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

import { NgModule, ModuleWithProviders, InjectionToken, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularModalGalleryComponent } from './components/modal-gallery.component';
import { DIRECTIVES } from './directives/directives';
import { UpperButtonsComponent } from './components/upper-buttons.component';
import { KeyboardService, } from './components/keyboard.service';
import { GalleryComponent } from './components/gallery.component';

export interface KeyboardServiceConfig {
  shortcuts: Array<string> | string;
}

export const KEYBOARD_CONFIGURATION = new InjectionToken<KeyboardServiceConfig>('KEYBOARD_CONFIGURATION');

/**
 * Module with `forRoot` method to import it in the root module of your application.
 */
@NgModule({
  imports: [ CommonModule ],
  declarations: [ AngularModalGalleryComponent, UpperButtonsComponent, GalleryComponent, DIRECTIVES ],
  exports: [ AngularModalGalleryComponent ]
})
export class ModalGalleryModule {
  static forRoot(config?: KeyboardServiceConfig): ModuleWithProviders {
    return {
      ngModule: ModalGalleryModule,
      providers: [
        {
          provide: KeyboardService,
          useFactory: setupRouter,
          deps: [ KEYBOARD_CONFIGURATION ]
        },
        {
          provide: KEYBOARD_CONFIGURATION,
          useValue: config ? config : {}
        }
      ]
    };
  }
}

export function setupRouter(injector: KeyboardServiceConfig) {
  return new KeyboardService(injector);
}

