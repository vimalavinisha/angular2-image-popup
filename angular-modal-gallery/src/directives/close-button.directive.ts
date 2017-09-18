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

import { Directive, Input, OnChanges, Renderer2, ElementRef, SimpleChanges, OnInit } from '@angular/core';

import { ButtonsConfig } from '../interfaces/buttons-config.interface';

/**
 * Directive to display the close button.
 * To hide this button, you must provide a ButtonsConfig object with 'close: false' as property.
 * All other configurations won't hide this button.
 */
@Directive({
  selector: '[close-button]'
})
export class CloseButtonDirective implements OnInit, OnChanges {

  @Input() configButtons: ButtonsConfig;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    this.applyStyle();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.applyStyle();
  }

  private applyStyle() {
    // apply [style.right]="" to close url <a></a>
    this.renderer.setStyle(this.el.nativeElement, 'right', '0px');

    const condition: boolean = this.configButtons === null || (this.configButtons && this.configButtons.close === false);
    // hide closeButton if configButtons.close is false
    this.renderer.setProperty(this.el.nativeElement, 'hidden', condition);
  }
}
