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

import { Input, Output, EventEmitter, Component } from '@angular/core';
import { Image } from './modal-gallery.component';

import { ButtonsConfig } from '../interfaces/buttons-config.interface';

/**
 * Component with all upper right buttons.
 * In fact, it uses a template with extUrl, download and close buttons with the right directive.
 * Also it emits click events as outputs.
 */
@Component({
  selector: 'upperButtons',
  styleUrls: ['upper-buttons.scss'],
  templateUrl: 'upper-buttons.html'
})
export class UpperButtonsComponent {

  @Input() image: Image;
  @Input() configButtons: ButtonsConfig;

  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() download: EventEmitter<boolean> = new EventEmitter<boolean>();

  downloadImage() {
    this.download.emit(true);
  }

  closeGallery() {
    this.close.emit(true);
  }
}
