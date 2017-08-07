/*
 * Copyright (C) 2015-2017 Stefano Cappa
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { Image } from './modal-gallery.component';
import { UpperButtonsComponent } from './upper-buttons.component';
import { DownloadButtonDirective } from '../directives/download-button.directive';
import { ExternalUrlButtonDirective } from '../directives/external-url-button.directive';
import { CloseButtonDirective } from '../directives/close-button.directive';

import { ButtonsConfig } from '../interfaces/buttons-config.interface';

let comp: UpperButtonsComponent;
let fixture: ComponentFixture<UpperButtonsComponent>;

const IMAGE_EXTURL: Image = new Image(
  './app/assets/images/gallery/img1.jpg',
  null,
  null,
  'http://www.google.com' // url
);

const IMAGE_NO_EXTURL: Image = new Image(
  './app/assets/images/gallery/img2.png',
  null,
  null,
  null // url
);

const DOWNLOAD_YES_CONFIGS: Array<any> = [
  {download: true, extUrl: false, close: false},
  {download: true, extUrl: false, close: true},
  {download: true, extUrl: true, close: false},
  {download: true, extUrl: true, close: true},
  {download: true, extUrl: true},
  {download: true, close: false},
  {download: true}
];

const DOWNLOAD_NO_CONFIGS: Array<any> = [
  {download: false, extUrl: false, close: false},
  {download: false, extUrl: false, close: true},
  {download: false, extUrl: true, close: false},
  {download: false, extUrl: true, close: true},
  {extUrl: true},
  {close: false},
];

const EXTURL_YES_CONFIGS: Array<any> = [
  {download: true, extUrl: true, close: false},
  {download: false, extUrl: true, close: true},
  {extUrl: true, close: false},
  {extUrl: true, close: true},
  {extUrl: true}
];

const EXTURL_NO_CONFIGS: Array<any> = [
  {download: true, extUrl: false, close: false},
  {download: false, extUrl: false, close: true},
  {extUrl: false, close: false},
  {extUrl: false, close: true},
  {download: true}
];

const CLOSE_YES_CONFIGS: Array<any> = [
  {extUrl: false, close: true},
  {extUrl: true, close: true},
  {extUrl: true}
];

const CLOSE_NO_CONFIGS: Array<any> = [
  {extUrl: false, close: false},
  {extUrl: true, close: false}
];

const WRONG_CONFIG: Array<any> = [
  null,
  undefined
];

function initTestBed() {
  TestBed.configureTestingModule({
    declarations: [
      UpperButtonsComponent,
      DownloadButtonDirective, CloseButtonDirective, ExternalUrlButtonDirective
    ]
  }); // not necessary with webpack .compileComponents();

  fixture = TestBed.createComponent(UpperButtonsComponent);
  comp = fixture.componentInstance;

  fixture.detectChanges();
  return fixture.whenStable().then(() => {
    fixture.detectChanges();
  });
}

describe('UpperButtonsComponent', () => {
  beforeEach(() => initTestBed());

  it('should instantiate it', () => expect(comp).not.toBeNull());

  describe('---YES---', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    DOWNLOAD_YES_CONFIGS.forEach((val: any, index: number) => {
      it(`should display the download button. Test i=${index}`, () => {
        updateInputs(IMAGE_EXTURL, val);
        const element: DebugElement = fixture.debugElement;
        const downloadBtnI: DebugElement = element.query(By.css('.download-image i'));
        expect(downloadBtnI.attributes['class']).toBe('fa fa-download');
        const downloadBtnDirective: DebugElement = element.query(By.directive(DownloadButtonDirective));
        expect(downloadBtnDirective.name).toBe('a');
        expect(downloadBtnDirective.properties['hidden']).toBe(false);
        expect(downloadBtnDirective.attributes['class']).toBe('download-image');
        expect(downloadBtnDirective.attributes['download-button']).toBe('');

        comp.download.subscribe((res: boolean) => {
          expect(res).toBe(true);
        });
        comp.close.subscribe((res: boolean) => {
          expect(res).toBe(false);
        });
        downloadBtnDirective.triggerEventHandler('click', null);
      });
    });

    EXTURL_YES_CONFIGS.forEach((val: any, index: number) => {
      it(`should display the exturl button. Test i=${index}`, () => {
        updateInputs(IMAGE_EXTURL, val);
        const element: DebugElement = fixture.debugElement;
        const extUrlBtnI: DebugElement = element.query(By.css('.external-url-image i'));
        expect(extUrlBtnI.attributes['class']).toBe('fa fa-external-link');
        const extUrlBtnDirective: DebugElement = element.query(By.directive(ExternalUrlButtonDirective));
        expect(extUrlBtnDirective.name).toBe('a');
        expect(extUrlBtnDirective.properties['hidden']).toBe(false);
        expect(extUrlBtnDirective.attributes['class']).toBe('external-url-image');
        expect(extUrlBtnDirective.attributes['exturl-button']).toBe('');

        comp.download.subscribe((res: boolean) => {
          expect(res).toBe(false);
        });
        comp.close.subscribe((res: boolean) => {
          expect(res).toBe(false);
        });
        extUrlBtnDirective.triggerEventHandler('click', null);
      });
    });

    CLOSE_YES_CONFIGS.forEach((val: any, index: number) => {
      it(`should display the close button. Test i=${index}`, () => {
        updateInputs(IMAGE_EXTURL, val);
        const element: DebugElement = fixture.debugElement;
        const closeBtnI: DebugElement = element.query(By.css('.close-popup i'));
        expect(closeBtnI.attributes['class']).toBe('fa fa-close');
        const closeBtnDirective: DebugElement = element.query(By.directive(CloseButtonDirective));
        expect(closeBtnDirective.name).toBe('a');
        expect(closeBtnDirective.properties['hidden']).toBe(false);
        expect(closeBtnDirective.attributes['class']).toBe('close-popup');
        expect(closeBtnDirective.attributes['close-button']).toBe('');

        comp.close.subscribe((res: boolean) => {
          expect(res).toBe(true);
        });
        closeBtnDirective.triggerEventHandler('click', null);
      });
    });
  });

  describe('---NO---', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    DOWNLOAD_YES_CONFIGS.forEach((val: any, index: number) => {
      it(`should display the download button, because extUrl is not valid, but there is a valid config. Test i=${index}`, () => {
        updateInputs(IMAGE_NO_EXTURL, val);
        const element: DebugElement = fixture.debugElement;
        const downloadBtnI: DebugElement = element.query(By.css('.download-image i'));
        expect(downloadBtnI.attributes['class']).toBe('fa fa-download');
        const downloadBtnDirective: DebugElement = element.query(By.directive(DownloadButtonDirective));
        expect(downloadBtnDirective.name).toBe('a');
        expect(downloadBtnDirective.properties['hidden']).toBe(false);
        expect(downloadBtnDirective.attributes['class']).toBe('download-image');
        expect(downloadBtnDirective.attributes['download-button']).toBe('');
      });
    });

    DOWNLOAD_NO_CONFIGS.forEach((val: any, index: number) => {
      it(`should NOT display the download button. Test i=${index}`, () => {
        updateInputs(IMAGE_EXTURL, val);
        const element: DebugElement = fixture.debugElement;
        const downloadBtnI: DebugElement = element.query(By.css('.download-image i'));
        expect(downloadBtnI.attributes['class']).toBe('fa fa-download');
        const downloadBtnDirective: DebugElement = element.query(By.directive(DownloadButtonDirective));
        expect(downloadBtnDirective.name).toBe('a');
        expect(downloadBtnDirective.properties['hidden']).toBe(true);
        expect(downloadBtnDirective.attributes['class']).toBe('download-image');
        expect(downloadBtnDirective.attributes['download-button']).toBe('');
      });
    });

    EXTURL_YES_CONFIGS.forEach((val: any, index: number) => {
      it(`should NOT display the exturl button, because extUrl is not valid, also with a valid config. Test i=${index}`, () => {
        updateInputs(IMAGE_NO_EXTURL, val);
        const element: DebugElement = fixture.debugElement;
        const extUrlBtnI: DebugElement = element.query(By.css('.external-url-image i'));
        expect(extUrlBtnI.attributes['class']).toBe('fa fa-external-link');
        const extUrlBtnDirective: DebugElement = element.query(By.directive(ExternalUrlButtonDirective));
        expect(extUrlBtnDirective.name).toBe('a');
        expect(extUrlBtnDirective.properties['hidden']).toBe(true);
        expect(extUrlBtnDirective.attributes['class']).toBe('external-url-image');
        expect(extUrlBtnDirective.attributes['exturl-button']).toBe('');
      });
    });

    EXTURL_NO_CONFIGS.forEach((val: any, index: number) => {
      it(`should NOT display the exturl button, because config is not valid. Test i=${index}`, () => {
        updateInputs(IMAGE_EXTURL, val);
        const element: DebugElement = fixture.debugElement;
        const extUrlBtnI: DebugElement = element.query(By.css('.external-url-image i'));
        expect(extUrlBtnI.attributes['class']).toBe('fa fa-external-link');
        const extUrlBtnDirective: DebugElement = element.query(By.directive(ExternalUrlButtonDirective));
        expect(extUrlBtnDirective.name).toBe('a');
        expect(extUrlBtnDirective.properties['hidden']).toBe(true);
        expect(extUrlBtnDirective.attributes['class']).toBe('external-url-image');
        expect(extUrlBtnDirective.attributes['exturl-button']).toBe('');
      });
    });

    CLOSE_NO_CONFIGS.forEach((val: any, index: number) => {
      it(`should NOT display the close button. Test i=${index}`, () => {
        updateInputs(IMAGE_EXTURL, val);
        const element: DebugElement = fixture.debugElement;
        const closeBtnI: DebugElement = element.query(By.css('.close-popup i'));
        expect(closeBtnI.attributes['class']).toBe('fa fa-close');
        const closeBtnDirective: DebugElement = element.query(By.directive(CloseButtonDirective));
        expect(closeBtnDirective.name).toBe('a');
        expect(closeBtnDirective.properties['hidden']).toBe(true);
        expect(closeBtnDirective.attributes['class']).toBe('close-popup');
        expect(closeBtnDirective.attributes['close-button']).toBe('');
      });
    });

    CLOSE_YES_CONFIGS.forEach((val: any, index: number) => {
      it(`should display the close button, because extUrl is not valid, but there is a valid config. Test i=${index}`, () => {
        updateInputs(IMAGE_NO_EXTURL, val);
        const element: DebugElement = fixture.debugElement;
        const closeBtnI: DebugElement = element.query(By.css('.close-popup i'));
        expect(closeBtnI.attributes['class']).toBe('fa fa-close');
        const closeBtnDirective: DebugElement = element.query(By.directive(CloseButtonDirective));
        expect(closeBtnDirective.name).toBe('a');
        expect(closeBtnDirective.properties['hidden']).toBe(false);
        expect(closeBtnDirective.attributes['class']).toBe('close-popup');
        expect(closeBtnDirective.attributes['close-button']).toBe('');
      });
    });
  });

  describe('---ERROR---', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    WRONG_CONFIG.forEach((val: any, index: number) => {
      it(`should manage wrong config objects. Test i=${index}`, () => {
        updateInputs(IMAGE_EXTURL, val);
        const element: DebugElement = fixture.debugElement;
        const downloadBtnDirective: DebugElement = element.query(By.directive(DownloadButtonDirective));
        const exturlBtnDirective: DebugElement = element.query(By.directive(ExternalUrlButtonDirective));
        const closeBtnDirective: DebugElement = element.query(By.directive(CloseButtonDirective));

        expect(downloadBtnDirective.properties['hidden']).toBe(true);
        expect(exturlBtnDirective.properties['hidden']).toBe(true);
        // how to check for undefined?
        // expect(closeBtnDirective.properties['hidden']).toBe(undefined);
        // expect(closeBtnDirective.properties['hidden']).toBeUndefined();
      });
    });

    it('should manage an empty config object', () => {
      updateInputs(IMAGE_EXTURL, {});
      const element: DebugElement = fixture.debugElement;
      const downloadBtnDirective: DebugElement = element.query(By.directive(DownloadButtonDirective));
      const exturlBtnDirective: DebugElement = element.query(By.directive(ExternalUrlButtonDirective));
      const closeBtnDirective: DebugElement = element.query(By.directive(CloseButtonDirective));

      expect(downloadBtnDirective.properties['hidden']).toBe(true);
      expect(exturlBtnDirective.properties['hidden']).toBe(true);
      expect(closeBtnDirective.properties['hidden']).toBe(false);
    });
  });
});

function updateInputs(image: Image, configButtons: ButtonsConfig) {
  comp.image = image;
  comp.configButtons = configButtons;
  fixture.detectChanges();
}
