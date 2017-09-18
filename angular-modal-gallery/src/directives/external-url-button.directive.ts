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

import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges, OnInit } from '@angular/core';

import { ButtonsConfig } from '../interfaces/buttons-config.interface';

/**
 * Directive to display the external url button.
 * To show this button, you must provide a ButtonsConfig object with 'extUrl: true' as property.
 * All other configurations will hide this button.
 * Pay attention, because this directive is quite smart to choose button's order using the
 * correct right margin in pixels. To do that, it uses also imgExtUrl and configButtons.
 */
@Directive({
  selector: '[exturl-button]'
})
export class ExternalUrlButtonDirective implements OnInit, OnChanges {

  @Input() configButtons: ButtonsConfig;
  @Input() imgExtUrl: string | void;

  private RIGHT: number = 63;

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit() {
    this.applyStyle();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.applyStyle();
  }

  private applyStyle() {
    let right: number = 0;
    if (this.configButtons && this.configButtons.extUrl && this.imgExtUrl) {
      right = this.getNumOfPrecedingButtons() * this.RIGHT;
    } else {
      right = 0;
    }

    // apply [style.right]="" to external url <a></a>
    this.renderer.setStyle(this.el.nativeElement, 'right', `${right}px`);

    // hide externalUrlButton based on this condition
    // configButtons && !configButtons.extUrl OR imgExtUrl is not valid (for instance is null)
    this.renderer.setProperty(this.el.nativeElement, 'hidden', !this.configButtons || (this.configButtons && !this.configButtons.extUrl) || !this.imgExtUrl);

  }

  private getNumOfPrecedingButtons() {
    let num: number = 0;
    if (!this.configButtons) {
      return num;
    }
    if (this.configButtons.close === undefined || this.configButtons.close === true) {
      num++;
    }
    return num;
  }
}
