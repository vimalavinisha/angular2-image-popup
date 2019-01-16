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

import { Injectable } from '@angular/core';
import { SidePreviewsConfig, SlideConfig } from '../model/slide-config.interface';
import { PlayConfig } from '../model/play-config.interface';
import { KS_DEFAULT_ACCESSIBILITY_CONFIG } from '../components/accessibility-default';
import { AccessibilityConfig } from '../model/accessibility.interface';
import { PreviewConfig } from '../model/preview-config.interface';
import { Size } from '../model/size.interface';

export interface LibConfig {
  slideConfig?: SlideConfig;
  accessibilityConfig?: AccessibilityConfig;
  previewConfig?: PreviewConfig;
}

export const DEFAULT_PREVIEW_SIZE: Size = { height: '50px', width: 'auto' };

const DEFAULT_CONFIG: LibConfig = {
  slideConfig: <SlideConfig>{
    infinite: false,
    playConfig: <PlayConfig>{ autoPlay: false, interval: 5000, pauseOnHover: true },
    sidePreviews: <SidePreviewsConfig>{ show: true, size: { width: '100px', height: 'auto' } }
  },
  accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
  previewConfig: <PreviewConfig>{
    visible: true,
    number: 3,
    arrows: true,
    clickable: true,
    // alwaysCenter: false, // TODO still not implemented
    size: DEFAULT_PREVIEW_SIZE
  }
};

/**
 * Service to handle library configuration in a unique place
 */
@Injectable()
export class ConfigService {
  config: LibConfig = DEFAULT_CONFIG;

  get(): LibConfig {
    return this.config;
  }

  set(obj: LibConfig): void {
    if (obj.slideConfig) {
      this.config.slideConfig = Object.assign({}, DEFAULT_CONFIG.slideConfig, obj.slideConfig);
    }
    if (obj.accessibilityConfig) {
      this.config.accessibilityConfig = Object.assign({}, DEFAULT_CONFIG.accessibilityConfig, obj.accessibilityConfig);
    }
    if (obj.previewConfig) {
      let newPreviewConfig: PreviewConfig = Object.assign({}, DEFAULT_CONFIG.previewConfig, obj.previewConfig);
      // if number is <= 0 reset to default
      if (obj.previewConfig && obj.previewConfig.number && obj.previewConfig.number <= 0) {
        // update newPreviewConfig with number
        newPreviewConfig = Object.assign({}, newPreviewConfig, { number: DEFAULT_CONFIG.previewConfig.number });
        this.config = Object.assign({}, { previewConfig: newPreviewConfig });
      }
      // finally sets the new config
      this.config = Object.assign({}, { previewConfig: newPreviewConfig });
    }
  }
}
