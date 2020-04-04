/*
 The MIT License (MIT)

 Copyright (c) 2017-2020 Stefano Cappa (Ks89)

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

import { Injectable } from '@angular/core';

import { LibConfig } from './config.service';

/**
 * Service to intercept ctrl+s (or cmd+s on macOS) using a third-party library, called Mousetrap.
 */
@Injectable({ providedIn: 'root' })
export class KeyboardService {
  /**
   * Private Mousetrap variable to store the instance.
   */
  private mousetrap: MousetrapInstance;

  init(config: LibConfig) {
    // temporary workaround to fix this issue: https://github.com/Ks89/angular-modal-gallery/issues/142
    if (!config.keyboardServiceConfig.disableSsrWorkaround) {
      // To prevent issues with angular-universal on server-side
      if (typeof window !== 'undefined') {
        require('mousetrap');
        this.mousetrap = new Mousetrap();
      }
    }
  }

  /**
   * Method to add a lister for ctrl+s/cmd+s keyboard events.
   * @param (e: KeyboardEvent, combo: string) => any onBind callback function to add shortcuts
   */
  add(onBind: (e: KeyboardEvent, combo: string) => any) {
    // temporary workaround to fix this issue: https://github.com/Ks89/angular-modal-gallery/issues/142
    if (!config.keyboardServiceConfig.disableSsrWorkaround) {
      // To prevent issues with angular-universal on server-side
      if (typeof window !== 'undefined') {
        this.mousetrap.bind(config.keyboardServiceConfig.shortcuts, (event: KeyboardEvent, combo: string) => {
          if (event.preventDefault) {
            event.preventDefault();
          } else {
            // internet explorer
            event.returnValue = false;
          }
          onBind(event, combo);
        });
      }
    }
  }

  /**
   * Method to reset all listeners. Please, call this function when needed
   * to free resources ad prevent leaks.
   */
  reset(config: LibConfig) {
    // temporary workaround to fix this issue: https://github.com/Ks89/angular-modal-gallery/issues/142
    if (!config.keyboardServiceConfig.disableSsrWorkaround) {
      // To prevent issues with angular-universal on server-side
      if (typeof window !== 'undefined') {
        this.mousetrap.reset();
      }
    }
  }
}
