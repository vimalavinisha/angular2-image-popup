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
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

import {Input, Output, EventEmitter, Component} from '@angular/core';
import {Image} from "./modal-gallery";

@Component({
  selector: 'upperButtons',
  styleUrls: ['upper-buttons.scss'],
  template: `
    <a class="external-url-image" [externalUrlButton]="showExtUrl" [imgExtUrl]="image.extUrl"
       href="{{image.extUrl}}"><i class="fa fa-external-link"></i></a>
    <a class="download-image" [downloadButton]="showDownload" [extUrlButton]="showExtUrl"
       [imgExtUrl]="image.extUrl" (click)="downloadImage()"><i class="fa fa-download"></i></a>
    <a class="close-popup" (click)="closeGallery()"><i class="fa fa-close"></i></a>
  `
})
export class UpperButtonsComponent {

  @Input() image: Image;
  @Input() showDownload: boolean = false;
  @Input() showExtUrl: boolean = false;

  @Output() close = new EventEmitter<boolean>();
  @Output() download = new EventEmitter<boolean>();

  downloadImage() {
    this.download.emit(true);
  }

  closeGallery() {
    this.close.emit(true);
  }
}
