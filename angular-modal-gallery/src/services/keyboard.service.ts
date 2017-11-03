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

import { Inject, Injectable } from '@angular/core';
import 'mousetrap';

import { KEYBOARD_CONFIGURATION } from '../modal-gallery.module';
import { KeyboardServiceConfig } from '../interfaces/keyboard-service-config.interface';

/**
 * Service to intercept ctrl+s (or cmd+s on macOS) using a third-party library, called Mousetrap.
 */
@Injectable()
export class KeyboardService {
  private mousetrap: MousetrapInstance;
  private shortcuts: Array<string> | string;

  constructor(@Inject(KEYBOARD_CONFIGURATION) private config: KeyboardServiceConfig) {
    this.shortcuts = this.config && this.config.shortcuts ? this.config.shortcuts : ['ctrl+s', 'meta+s'];
    this.mousetrap = new (<any>Mousetrap)();
  }

  /**
   * Method to add a lister for ctrl+s/cmd+s keyboard events.
   * @param onBind Callback function
   */
  add(onBind: (e: ExtendedKeyboardEvent, combo: string) => any) {
    this.mousetrap.bind(this.shortcuts, (event: KeyboardEvent, combo: string) => {
      if (event.preventDefault) {
        event.preventDefault();
      } else {
        // internet explorer
        event.returnValue = false;
      }
      onBind(event, combo);
    });
  }

  /**
   * Useful function to reset all listeners. Please, call this function when needed
   * to free resources ad prevent leaks.
   */
  reset() {
    this.mousetrap.reset();
  }
}
