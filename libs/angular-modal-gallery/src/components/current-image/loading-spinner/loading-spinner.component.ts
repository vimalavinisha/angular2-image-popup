/*
 The MIT License (MIT)

 Copyright (c) 2017-2018 Stefano Cappa (Ks89)

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

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { AccessibilityConfig, LoadingConfig, LoadingType } from '../../../model';

/**
 * Component with the loading spinner
 */
@Component({
  selector: 'ks-loading-spinner',
  styleUrls: [
    'style-loading-spinner-standard.css',
    'style-loading-spinner-dots.css',
    'style-loading-spinner-bars.css',
    'style-loading-spinner-circular.css'
  ],
  templateUrl: 'loading-spinner.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingSpinnerComponent {
  /**
   * Object of type `LoadingConfig` exposed to the template.
   * It contains fields like enable/disable and a way to choose a loading spinner.
   */
  @Input() loadingConfig: LoadingConfig;
  /**
   * Object of type `AccessibilityConfig` to init custom accessibility features.
   * For instance, it contains titles, alt texts, aria-labels and so on.
   */
  @Input() accessibilityConfig: AccessibilityConfig;

  /**
   * Enum of type `LoadingType` to choose the standard loading spinner.
   * Declared here to be used inside the template.
   */
  loadingStandard: LoadingType = LoadingType.STANDARD;
  /**
   * Enum of type `LoadingType` to choose the bars loading spinner.
   * Declared here to be used inside the template.
   */
  loadingBars: LoadingType = LoadingType.BARS;
  /**
   * Enum of type `LoadingType` to choose the circular loading spinner.
   * Declared here to be used inside the template.
   */
  loadingCircular: LoadingType = LoadingType.CIRCULAR;
  /**
   * Enum of type `LoadingType` to choose the dots loading spinner.
   * Declared here to be used inside the template.
   */
  loadingDots: LoadingType = LoadingType.DOTS;
}
