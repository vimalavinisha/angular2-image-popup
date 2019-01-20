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
import { ButtonsConfig, ButtonsStrategy } from '../model/buttons-config.interface';
import { DotsConfig } from '../model/dots-config.interface';
import { AdvancedLayout, GridLayout, LineLayout, PlainGalleryConfig, PlainGalleryStrategy } from '../model/plain-gallery-config.interface';
import { CurrentImageConfig } from '../model/current-image-config.interface';
import { KeyboardConfig } from '../model/keyboard-config.interface';
import { LoadingConfig, LoadingType } from '../model/loading-config.interface';
import { Description, DescriptionStrategy, DescriptionStyle } from '../model/description.interface';

export interface LibConfig {
  slideConfig?: SlideConfig;
  accessibilityConfig?: AccessibilityConfig;
  previewConfig?: PreviewConfig;
  buttonsConfig?: ButtonsConfig;
  dotsConfig?: DotsConfig;
  plainGalleryConfig?: PlainGalleryConfig;
  currentImageConfig?: CurrentImageConfig;
  keyboardConfig?: KeyboardConfig;
}

export const DEFAULT_PREVIEW_SIZE: Size = { height: '50px', width: 'auto' };
export const DEFAULT_LAYOUT: LineLayout = new LineLayout(DEFAULT_PREVIEW_SIZE, { length: -1, wrap: false }, 'flex-start');
export const DEFAULT_PLAIN_CONFIG: PlainGalleryConfig = {
  strategy: PlainGalleryStrategy.ROW,
  layout: DEFAULT_LAYOUT,
  advanced: { aTags: false, additionalBackground: '50% 50%/cover' }
};
export const DEFAULT_LOADING: LoadingConfig = { enable: true, type: LoadingType.STANDARD };
export const DEFAULT_DESCRIPTION_STYLE: DescriptionStyle = {
  bgColor: 'rgba(0, 0, 0, .5)',
  textColor: 'white',
  marginTop: '0px',
  marginBottom: '0px',
  marginLeft: '0px',
  marginRight: '0px'
};
export const DEFAULT_DESCRIPTION: Description = {
  strategy: DescriptionStrategy.ALWAYS_VISIBLE,
  imageText: 'Image ',
  numberSeparator: '/',
  beforeTextDescription: ' - ',
  style: DEFAULT_DESCRIPTION_STYLE
};
export const DEFAULT_CURRENT_IMAGE_CONFIG: CurrentImageConfig = {
  navigateOnClick: true,
  loadingConfig: DEFAULT_LOADING,
  description: DEFAULT_DESCRIPTION,
  downloadable: false,
  invertSwipe: false
};

const DEFAULT_CONFIG: LibConfig = Object.freeze({
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
  },
  buttonsConfig: <ButtonsConfig>{ visible: true, strategy: ButtonsStrategy.DEFAULT },
  dotsConfig: <DotsConfig>{ visible: true },
  plainGalleryConfig: DEFAULT_PLAIN_CONFIG,
  currentImageConfig: DEFAULT_CURRENT_IMAGE_CONFIG,
  keyboardConfig: null // by default nothing, because the library uses default buttons automatically
});

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
    const newConfig: LibConfig = Object.assign({}, this.config);
    if (obj.slideConfig) {
      newConfig.slideConfig = Object.assign({}, DEFAULT_CONFIG.slideConfig, obj.slideConfig);
    }
    if (obj.accessibilityConfig) {
      newConfig.accessibilityConfig = Object.assign({}, DEFAULT_CONFIG.accessibilityConfig, obj.accessibilityConfig);
    }
    if (obj.previewConfig) {
      const newPreviewConfig: PreviewConfig = Object.assign({}, DEFAULT_CONFIG.previewConfig, obj.previewConfig);
      // if number is <= 0 reset to default
      if (obj.previewConfig && obj.previewConfig.number && obj.previewConfig.number <= 0) {
        // force default number
        newPreviewConfig.number = DEFAULT_CONFIG.previewConfig.number;
      }
      newConfig.previewConfig = Object.assign({}, DEFAULT_CONFIG.previewConfig, newPreviewConfig);
    }
    if (obj.buttonsConfig) {
      newConfig.buttonsConfig = Object.assign({}, DEFAULT_CONFIG.buttonsConfig, obj.buttonsConfig);
    }
    if (obj.dotsConfig) {
      newConfig.dotsConfig = Object.assign({}, DEFAULT_CONFIG.dotsConfig, obj.dotsConfig);
    }
    if (obj.plainGalleryConfig) {
      newConfig.plainGalleryConfig = initPlainGalleryConfig(obj.plainGalleryConfig);
    }
    if (obj.currentImageConfig) {
      newConfig.currentImageConfig = Object.assign({}, DEFAULT_CONFIG.currentImageConfig, obj.currentImageConfig);
    }
    this.config = newConfig;
  }
}

/**
 * Function to build and return a `PlainGalleryConfig` object, proving also default values and validating the input object.
 * @param plainGalleryConfig object with the config requested by user
 * @returns PlainGalleryConfig the plain gallery configuration
 * @throws an Error if layout and strategy aren't compatible
 */
function initPlainGalleryConfig(plainGalleryConfig): PlainGalleryConfig {
  const newPlayGalleryConfig: PlainGalleryConfig = Object.assign({}, DEFAULT_CONFIG.plainGalleryConfig, plainGalleryConfig);

  if (newPlayGalleryConfig.layout instanceof LineLayout) {
    if (newPlayGalleryConfig.strategy !== PlainGalleryStrategy.ROW && newPlayGalleryConfig.strategy !== PlainGalleryStrategy.COLUMN) {
      throw new Error('LineLayout requires either ROW or COLUMN strategy');
    }
    if (!newPlayGalleryConfig.layout || !newPlayGalleryConfig.layout.breakConfig) {
      throw new Error('Both layout and breakConfig must be valid');
    }
  }

  if (newPlayGalleryConfig.layout instanceof GridLayout) {
    if (newPlayGalleryConfig.strategy !== PlainGalleryStrategy.GRID) {
      throw new Error('GridLayout requires GRID strategy');
    }
    if (!newPlayGalleryConfig.layout || !newPlayGalleryConfig.layout.breakConfig) {
      throw new Error('Both layout and breakConfig must be valid');
    }
    // force wrap for grid layout
    newPlayGalleryConfig.layout.breakConfig.wrap = true;
  }

  if (newPlayGalleryConfig.layout instanceof AdvancedLayout) {
    if (newPlayGalleryConfig.strategy !== PlainGalleryStrategy.CUSTOM) {
      throw new Error('AdvancedLayout requires CUSTOM strategy');
    }
  }
  return newPlayGalleryConfig;
}
