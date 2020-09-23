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

import { waitForAsync, inject, TestBed } from '@angular/core/testing';

import cloneDeep from 'lodash-es/cloneDeep';

import { ConfigService, DEFAULT_CAROUSEL_BREAKPOINTS, DEFAULT_CAROUSEL_PREVIEWS_CONFIG, DEFAULT_CURRENT_CAROUSEL_CONFIG, DEFAULT_CURRENT_CAROUSEL_PLAY, DEFAULT_KEYBOARD_SERVICE_CONFIG } from './config.service';
import { LibConfig } from '../model/lib-config.interface';
import { ButtonsConfig, ButtonsStrategy, ButtonType } from '../model/buttons-config.interface';
import { AccessibilityConfig } from '../model/accessibility.interface';
import { KS_DEFAULT_ACCESSIBILITY_CONFIG } from '../components/accessibility-default';
import { Size } from '../model/size.interface';
import { DotsConfig } from '../model/dots-config.interface';
import { KeyboardConfig } from '../model/keyboard-config.interface';
import { CarouselConfig } from '../model/carousel-config.interface';
import { PlayConfig } from '../model/play-config.interface';
import { KeyboardServiceConfig } from '../model/keyboard-service-config.interface';
import { CarouselPreviewConfig } from '../model/carousel-preview-config.interface';

// tslint:disable:no-shadowed-variable

describe('ConfigService', () => {

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [ConfigService]
      });
    })
  );

  it('should instantiate service when inject service',
    inject([ConfigService], (service: ConfigService) => {
      expect(service instanceof ConfigService).toEqual(true);
    })
  );

  describe('#setConfig()', () => {

    describe('---YES---', () => {

      it(`should call setConfig to update the library configuration with an undefined accessibilityConfig`,
        inject([ConfigService], (service: ConfigService) => {
          const inputConfig: LibConfig = {
            accessibilityConfig: undefined
          };
          service.setConfig(1, inputConfig);
          const result: LibConfig | undefined = service.getConfig(1);
          expect(result?.accessibilityConfig).toEqual(KS_DEFAULT_ACCESSIBILITY_CONFIG);
        })
      );

      it(`should call setConfig to update the library configuration with a custom accessibilityConfig`,
        inject([ConfigService], (service: ConfigService) => {
          const inputConfig: LibConfig = {
            accessibilityConfig: {
              backgroundAriaLabel: 'example-test'
            } as AccessibilityConfig
          };
          service.setConfig(1, inputConfig);
          const result: LibConfig | undefined = service.getConfig(1);
          expect(result?.accessibilityConfig?.backgroundAriaLabel).toEqual(inputConfig.accessibilityConfig?.backgroundAriaLabel);
          delete result?.accessibilityConfig?.backgroundAriaLabel;
          const clonedDefault: AccessibilityConfig = cloneDeep(KS_DEFAULT_ACCESSIBILITY_CONFIG);
          delete clonedDefault?.backgroundAriaLabel;
          expect(result?.accessibilityConfig).toEqual(clonedDefault);
        })
      );

      it(`should call setConfig to update the library configuration with an undefined buttonsConfig`,
        inject([ConfigService], (service: ConfigService) => {
          const inputConfig: LibConfig = {
            buttonsConfig: undefined
          };
          service.setConfig(1, inputConfig);
          const result: LibConfig | undefined = service.getConfig(1);
          expect(result?.buttonsConfig).toEqual({visible: true, strategy: ButtonsStrategy.DEFAULT});
        })
      );

      it(`should call setConfig to update the library configuration with a custom buttonsConfig`,
        inject([ConfigService], (service: ConfigService) => {
          const customConfig: ButtonsConfig = {
            visible: false,
            strategy: ButtonsStrategy.CUSTOM,
            buttons: [{
              className: 'fake',
              size: {height: '100px', width: '200px'} as Size,
              fontSize: '12px',
              type: ButtonType.CUSTOM,
              title: 'fake title',
              ariaLabel: 'fake aria label',
              extUrlInNewTab: false
            }]
          };
          const inputConfig: LibConfig = {
            buttonsConfig: customConfig
          };
          service.setConfig(1, inputConfig);
          const result: LibConfig | undefined = service.getConfig(1);
          expect(result?.buttonsConfig?.visible).toEqual(inputConfig.buttonsConfig?.visible);
          expect(result?.buttonsConfig?.strategy).toEqual(inputConfig.buttonsConfig?.strategy);
          expect(result?.buttonsConfig?.buttons).toEqual(inputConfig.buttonsConfig?.buttons);
        })
      );

      it(`should call setConfig to update the library configuration with an undefined dotsConfig`,
        inject([ConfigService], (service: ConfigService) => {
          const inputConfig: LibConfig = {
            dotsConfig: undefined
          };
          service.setConfig(1, inputConfig);
          const result: LibConfig | undefined = service.getConfig(1);
          expect(result?.dotsConfig).toEqual({visible: true} as DotsConfig);
        })
      );

      it(`should call setConfig to update the library configuration with a custom dotsConfig`,
        inject([ConfigService], (service: ConfigService) => {
          const inputConfig: LibConfig = {
            dotsConfig: {visible: false} as DotsConfig
          };
          service.setConfig(1, inputConfig);
          const result: LibConfig | undefined = service.getConfig(1);
          expect(result?.dotsConfig?.visible).toEqual(inputConfig.dotsConfig?.visible);
        })
      );

      it(`should call setConfig to update the library configuration with an undefined keyboardConfig`,
        inject([ConfigService], (service: ConfigService) => {
          const inputConfig: LibConfig = {
            keyboardConfig: undefined
          };
          service.setConfig(1, inputConfig);
          const result: LibConfig | undefined = service.getConfig(1);
          expect(result?.keyboardConfig).toEqual(undefined);
        })
      );

      it(`should call setConfig to update the library configuration with a custom keyboardConfig`,
        inject([ConfigService], (service: ConfigService) => {
          const inputConfig: LibConfig = {
            keyboardConfig: {
              esc: 10,
              right: 11,
              left: 12
            } as KeyboardConfig
          };
          service.setConfig(1, inputConfig);
          const result: LibConfig | undefined = service.getConfig(1);
          expect(result?.keyboardConfig).toEqual(inputConfig.keyboardConfig);
        })
      );

      it(`should call setConfig to update the library configuration with an undefined carouselConfig`,
        inject([ConfigService], (service: ConfigService) => {
          const inputConfig: LibConfig = {
            carouselConfig: undefined
          };
          service.setConfig(1, inputConfig);
          const result: LibConfig | undefined = service.getConfig(1);
          expect(result?.carouselConfig).toEqual(DEFAULT_CURRENT_CAROUSEL_CONFIG);
        })
      );

      it(`should call setConfig to update the library configuration with a custom carouselConfig`,
        inject([ConfigService], (service: ConfigService) => {
          const inputConfig: LibConfig = {
            carouselConfig: {
              maxWidth: '80%',
              maxHeight: '200px',
              showArrows: false,
              objectFit: 'cover',
              keyboardEnable: false,
              modalGalleryEnable: false,
              legacyIE11Mode: true
            } as CarouselConfig
          };
          service.setConfig(1, inputConfig);
          const result: LibConfig | undefined = service.getConfig(1);
          expect(result?.carouselConfig).toEqual(inputConfig.carouselConfig);
        })
      );

      it(`should call setConfig to update the library configuration with an undefined carouselPlayConfig`,
        inject([ConfigService], (service: ConfigService) => {
          const inputConfig: LibConfig = {
            carouselPlayConfig: undefined
          };
          service.setConfig(1, inputConfig);
          const result: LibConfig | undefined = service.getConfig(1);
          expect(result?.carouselPlayConfig).toEqual(DEFAULT_CURRENT_CAROUSEL_PLAY);
        })
      );

      it(`should call setConfig to update the library configuration with a custom carouselPlayConfig`,
        inject([ConfigService], (service: ConfigService) => {
          const inputConfig: LibConfig = {
            carouselPlayConfig: {
              autoPlay: false,
              interval: 1000,
              pauseOnHover: false
            } as PlayConfig
          };
          service.setConfig(1, inputConfig);
          const result: LibConfig | undefined = service.getConfig(1);
          expect(result?.carouselPlayConfig).toEqual(inputConfig.carouselPlayConfig);
        })
      );

      it(`should call setConfig to update the library configuration with an undefined carouselPreviewsConfig`,
        inject([ConfigService], (service: ConfigService) => {
          const inputConfig: LibConfig = {
            carouselPreviewsConfig: undefined
          };
          service.setConfig(1, inputConfig);
          const result: LibConfig | undefined = service.getConfig(1);
          expect(result?.carouselPreviewsConfig).toEqual(DEFAULT_CAROUSEL_PREVIEWS_CONFIG);
        })
      );

      it(`should call setConfig to update the library configuration with an undefined carouselPreviewsConfig without 'breakpoints'`,
        inject([ConfigService], (service: ConfigService) => {
          const inputConfig: LibConfig = {
            carouselPreviewsConfig: {
              visible: true,
              number: 4,
              arrows: true,
              clickable: true,
              width: 100 / 4 + '%',
              maxHeight: '200px'
            } as CarouselPreviewConfig
          };
          service.setConfig(1, inputConfig);
          const result: LibConfig | undefined = service.getConfig(1);
          expect(result?.carouselPreviewsConfig).toEqual(DEFAULT_CAROUSEL_PREVIEWS_CONFIG);
        })
      );

      [0, -1].forEach((item: number, index: number) => {
        it(`should call setConfig to update the library configuration with a custom carouselPreviewsConfig with invalid 'number'. Test i = ${index}`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              carouselPreviewsConfig: {
                visible: false,
                number: item,
                arrows: false,
                clickable: false,
                width: 100 / 2 + '%',
                maxHeight: '100px',
                breakpoints: DEFAULT_CAROUSEL_BREAKPOINTS
              } as CarouselPreviewConfig
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            const numberVal: number = DEFAULT_CAROUSEL_PREVIEWS_CONFIG.number as number;
            const widthVal: number = 100 / numberVal;
            expect(result?.carouselPreviewsConfig?.visible).toEqual(inputConfig.carouselPreviewsConfig?.visible);
            expect(result?.carouselPreviewsConfig?.number).toEqual(numberVal);
            expect(result?.carouselPreviewsConfig?.arrows).toEqual(inputConfig.carouselPreviewsConfig?.arrows);
            expect(result?.carouselPreviewsConfig?.clickable).toEqual(inputConfig.carouselPreviewsConfig?.clickable);
            expect(result?.carouselPreviewsConfig?.width).toEqual(`${widthVal}%`);
            expect(result?.carouselPreviewsConfig?.maxHeight).toEqual(inputConfig.carouselPreviewsConfig?.maxHeight);
            expect(result?.carouselPreviewsConfig?.breakpoints).toEqual(inputConfig.carouselPreviewsConfig?.breakpoints);
          })
        );
      });

      it(`should call setConfig to update the library configuration with an undefined carouselDotsConfig`,
        inject([ConfigService], (service: ConfigService) => {
          const inputConfig: LibConfig = {
            carouselDotsConfig: undefined
          };
          service.setConfig(1, inputConfig);
          const result: LibConfig | undefined = service.getConfig(1);
          expect(result?.carouselDotsConfig).toEqual({ visible: true } as DotsConfig);
        })
      );

      it(`should call setConfig to update the library configuration with a custom carouselDotsConfig`,
        inject([ConfigService], (service: ConfigService) => {
          const inputConfig: LibConfig = {
            carouselDotsConfig: { visible: false }  as DotsConfig
          };
          service.setConfig(1, inputConfig);
          const result: LibConfig | undefined = service.getConfig(1);
          expect(result?.carouselDotsConfig).toEqual(inputConfig.carouselDotsConfig);
        })
      );

      it(`should call setConfig to update the library configuration with an undefined keyboardServiceConfig`,
        inject([ConfigService], (service: ConfigService) => {
          const inputConfig: LibConfig = {
            keyboardServiceConfig: undefined
          };
          service.setConfig(1, inputConfig);
          const result: LibConfig | undefined = service.getConfig(1);
          expect(result?.keyboardServiceConfig).toEqual(DEFAULT_KEYBOARD_SERVICE_CONFIG);
        })
      );

      it(`should call setConfig to update the library configuration with a custom keyboardServiceConfig`,
        inject([ConfigService], (service: ConfigService) => {
          const inputConfig: LibConfig = {
            keyboardServiceConfig: {
              shortcuts: ['ctrl+s'],
              disableSsrWorkaround: true
            }  as KeyboardServiceConfig
          };
          service.setConfig(1, inputConfig);
          const result: LibConfig | undefined = service.getConfig(1);
          expect(result?.keyboardServiceConfig).toEqual(inputConfig.keyboardServiceConfig);
        })
      );

      it(`should call setConfig to update the library configuration with an undefined enableCloseOutside`,
        inject([ConfigService], (service: ConfigService) => {
          const inputConfig: LibConfig = {
            enableCloseOutside: undefined
          };
          service.setConfig(1, inputConfig);
          const result: LibConfig | undefined = service.getConfig(1);
          expect(result?.enableCloseOutside).toEqual(true);
        })
      );

      it(`should call setConfig to update the library configuration with a custom enableCloseOutside`,
        inject([ConfigService], (service: ConfigService) => {
          const inputConfig: LibConfig = {
            enableCloseOutside: false
          };
          service.setConfig(1, inputConfig);
          const result: LibConfig | undefined = service.getConfig(1);
          expect(result?.enableCloseOutside).toEqual(inputConfig.enableCloseOutside);
        })
      );

      it(`should call setConfig with an undefined configuration object.`,
        inject([ConfigService], (service: ConfigService) => {
          service.setConfig(1, undefined);
          const result: LibConfig | undefined = service.getConfig(1);
          console.log('result', result);
        })
      );
    });

    describe('---NO---', () => {
      it(`should throw an error if carouselPlayConfig.interval is < 0`,
        inject([ConfigService], (service: ConfigService) => {
          const inputConfig: LibConfig = {
            carouselPlayConfig: {
              autoPlay: false,
              interval: -1,
              pauseOnHover: false
            } as PlayConfig
          };
          expect(() => service.setConfig(1, inputConfig)).toThrowError(`Carousel's interval must be a number >= 0`);
        })
      );
    });
  });
});
