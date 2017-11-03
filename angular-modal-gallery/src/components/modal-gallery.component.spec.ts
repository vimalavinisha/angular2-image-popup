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
import { DebugElement, InjectionToken } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/takeLast';

import {
  Action, AngularModalGalleryComponent, Description, Image, ImageModalEvent,
  Keyboard
} from './modal-gallery.component';

import { KeyboardService } from '../services/keyboard.service';
import { UpperButtonsComponent } from './upper-buttons.component';
import { GalleryComponent } from './gallery.component';
import { CloseButtonDirective } from '../directives/close-button.directive';
import { ExternalUrlButtonDirective } from '../directives/external-url-button.directive';
import { DownloadButtonDirective } from '../directives/download-button.directive';
import { ClickOutsideDirective } from '../directives/click-outside.directive';

import { ButtonsConfig } from '../interfaces/buttons-config.interface';
import { KeyboardServiceConfig } from '../interfaces/keyboard-service-config.interface';

const KEYBOARD_CONFIGURATION = new InjectionToken<KeyboardServiceConfig>('KEYBOARD_CONFIGURATION');

function setupRouter(injector: KeyboardServiceConfig) {
  return new KeyboardService(injector);
}

import 'hammerjs';
import 'mousetrap';

let comp: AngularModalGalleryComponent;
let fixture: ComponentFixture<AngularModalGalleryComponent>;

const IMAGES: Array<Image> = [
  new Image(
    './app/assets/images/gallery/img1.jpg',
    null, // no thumb
    null, // no description
    'http://www.google.com'
  ),
  new Image(
    './app/assets/images/gallery/img2.png', // example with a PNG image
    null, // no thumb
    'Description 2',
    null // url
  ),
  new Image(
    './app/assets/images/gallery/img3.jpg',
    './app/assets/images/gallery/thumbs/img3.png', // example with a PNG thumb image
    'Description 3',
    'http://www.google.com'
  ),
  new Image(
    './app/assets/images/gallery/img4.jpg',
    null, // no thumb
    'Description 4',
    'http://www.google.com'
  ),
  new Image(
    './app/assets/images/gallery/img5.jpg',
    './app/assets/images/gallery/thumbs/img5.jpg',
    null, // no description
    null // url
  ),
  new Image(
    './app/assets/images/gallery/img5.jpg',
    undefined, undefined, undefined
  ),
  new Image(
    './app/assets/images/gallery/img5.jpg',
    null, null, null
  )
];

function initTestBed() {
  TestBed.configureTestingModule({
    declarations: [AngularModalGalleryComponent, UpperButtonsComponent,
      GalleryComponent, CloseButtonDirective, ExternalUrlButtonDirective,
      DownloadButtonDirective, ClickOutsideDirective],
  }).overrideComponent(AngularModalGalleryComponent, {
    set: {
      providers: [
        {
          provide: KeyboardService,
          useFactory: setupRouter,
          deps: [ KEYBOARD_CONFIGURATION ]
        },
        {
          provide: KEYBOARD_CONFIGURATION,
          useValue: {}
        }
      ]
    }
  }); // not necessary with webpack .compileComponents();

  fixture = TestBed.createComponent(AngularModalGalleryComponent);
  comp = fixture.componentInstance;

  fixture.detectChanges();
  return fixture.whenStable().then(() => {
    fixture.detectChanges();
  });
}

describe('AngularModalGalleryComponent', () => {
  beforeEach(() => initTestBed());

  it('should instantiate it', () => expect(comp).not.toBeNull());

  describe('---YES---', () => {
    beforeEach(() => fixture.detectChanges());

    it('should display the gallery of thumbs with a single element (Array)', () => {
      updateInputs([IMAGES[0]]);
      fixture.detectChanges();
      // gallery of thumbs is visible
      let imgs: DebugElement[] = fixture.debugElement.queryAll(By.css('img.ng-thumb'));
      expect(imgs.length).toBe(1);
    });

    it('should display the gallery of thumbs with some elements (Array)', () => {
      updateInputs(IMAGES);
      fixture.detectChanges();
      // gallery of thumbs is visible
      let imgs: DebugElement[] = fixture.debugElement.queryAll(By.css('img.ng-thumb'));
      expect(imgs.length).toBe(IMAGES.length);
    });

    it('should display the gallery of thumbs with some elements (Observable)', () => {
      comp.hasData.subscribe((out: ImageModalEvent) => {
        expect(out.action).toBe(Action.LOAD);
        expect(out.result).toBeTruthy();
      });
      updateInputs(Observable.of(IMAGES));
      fixture.detectChanges();
      // gallery of thumbs is visible
      let imgs: DebugElement[] = fixture.debugElement.queryAll(By.css('img.ng-thumb'));
      expect(imgs.length).toBe(IMAGES.length);
    });

    IMAGES.forEach((val: Image, index: number) => {
      it(`should display the modal gallery after a click on the thumb with index=${index} (Array)`, () => {
        updateInputs(IMAGES);
        openModalGalleryByThumbIndex(index);
        testArrowsVisibility();
      });
    });

    it('should display the modal gallery and navigate to the first image', () => {
      // first image
      comp.firstImage.subscribe((out: ImageModalEvent) => {
        expect(out.action).toBe(Action.NORMAL);
        expect(out.result).toBeTruthy();
      });

      updateInputs(IMAGES);
      openModalGalleryByThumbIndex(1);
      testArrowsVisibility();

      let left: DebugElement = fixture.debugElement.query(By.css('a.nav-left'));
      left.triggerEventHandler('click', null);
      fixture.detectChanges();
    });

    it('should display the modal gallery and navigate to the first image from the end', () => {
      // first image
      comp.firstImage.subscribe((out: ImageModalEvent) => {
        expect(out.action).toBe(Action.NORMAL);
        expect(out.result).toBeTruthy();
      });

      updateInputs(IMAGES);
      openModalGalleryByThumbIndex(IMAGES.length - 1);
      testArrowsVisibility();

      let right: DebugElement = fixture.debugElement.query(By.css('a.nav-right'));
      right.triggerEventHandler('click', null);
      fixture.detectChanges();
    });

    it('should display the modal gallery and navigate to the last image', () => {
      // last image
      comp.lastImage.subscribe((out: ImageModalEvent) => {
        expect(out.action).toBe(Action.NORMAL);
        expect(out.result).toBeTruthy();
      });

      updateInputs(IMAGES);
      openModalGalleryByThumbIndex(IMAGES.length - 2);
      testArrowsVisibility();

      let right: DebugElement = fixture.debugElement.query(By.css('a.nav-right'));
      right.triggerEventHandler('click', null);
      fixture.detectChanges();
    });

    it('should display the modal gallery and navigate to the last image from the beginning', () => {
      // last image
      comp.lastImage.subscribe((out: ImageModalEvent) => {
        expect(out.action).toBe(Action.NORMAL);
        expect(out.result).toBeTruthy();
      });

      updateInputs(IMAGES);
      openModalGalleryByThumbIndex(0);
      testArrowsVisibility();

      let left: DebugElement = fixture.debugElement.query(By.css('a.nav-left'));
      left.triggerEventHandler('click', null);
      fixture.detectChanges();
    });


    it('should display the modal gallery and navigate to the NEXT image (not the last one) clicking on the modal image', () => {
      const element: DebugElement = fixture.debugElement;
      const index: number = 0;

      comp.hasData.subscribe((out: ImageModalEvent) => {
        expect(out.action).toBe(Action.LOAD);
        expect(out.result).toBeTruthy();
      });

      updateInputs(IMAGES);

      comp.show.subscribe((out: ImageModalEvent) => {
        // out contains the result, i.e. image number and not the image index.
        // this is important, because clicking on thumb `0`, I'll receive `1` as a response.
        // imageNumber is the clicked image number (not index (0...), but number (1...)),
        // imageNumber + 1 is the next image index (because in this test I navigate to the next image
        const imageNumber: number = index + 1;
        expect((out.action === Action.LOAD) || (out.action === Action.CLICK)).toBeTruthy();
        // FIXME please improve this
        expect((out.result === (imageNumber) || (out.result === (imageNumber + 1)))).toBeTruthy();
      });

      let imgs: DebugElement[] = fixture.debugElement.queryAll(By.css('img.ng-thumb'));
      expect(imgs.length).toBe(IMAGES.length);
      imgs[index].triggerEventHandler('click', null);
      fixture.detectChanges();

      testArrowsVisibility();

      let img: DebugElement = element.query(By.css('img.effect'));
      expect(img).not.toBeUndefined();
      img.triggerEventHandler('click', null);
      fixture.detectChanges();
    });

    it('should display the modal gallery and navigate to the NEXT image (not the last one)', () => {
      const element: DebugElement = fixture.debugElement;
      let index: number = 1;

      updateInputs(IMAGES);

      comp.show.subscribe((out: ImageModalEvent) => {
        // out contains the result, i.e. image number and not the image index.
        // this is important, because clicking on thumb `0`, I'll receive `1` as a response.
        // imageNumber is the clicked image number (not index (0...), but number (1...)),
        // imageNumber + 1 is the next image index (because in this test I navigate to the next image
        const imageNumber: number = index + 1;
        expect((out.action === Action.NORMAL) || (out.action === Action.LOAD)).toBeTruthy();
        // FIXME please improve this
        expect((out.result === (imageNumber) || (out.result === (imageNumber + 1)))).toBeTruthy();
      });

      openModalGalleryByThumbIndex(index);
      fixture.detectChanges();
      testArrowsVisibility();

      let right: DebugElement = element.query(By.css('a.nav-right'));
      right.triggerEventHandler('click', null);
      fixture.detectChanges();
    });

    it('(FIXME - broken? why?)should display the modal gallery and navigate to the PREVIOUS image (not the first one)', () => {
      const element: DebugElement = fixture.debugElement;
      let index: number = 1;

      updateInputs(IMAGES);

      openModalGalleryByThumbIndex(index);
      testArrowsVisibility();

      comp.show.subscribe((out: ImageModalEvent) => {
        // out contains the result, i.e. image number and not the image index.
        // this is important, because clicking on thumb `0`, I'll receive `1` as a response.
        // imageNumber is the clicked image number (not index (0...), but number (1...)),
        // imageNumber - 1 is the previous image index (because in this test I navigate to the previous image
        const imageNumber: number = index + 1;
        expect((out.action === Action.NORMAL) || (out.action === Action.LOAD)).toBeTruthy();
        // FIXME please improve this
        expect((out.result === (imageNumber) || (out.result === (imageNumber - 1)))).toBeTruthy();
      });

      let left: DebugElement = element.query(By.css('a.nav-left'));
      left.triggerEventHandler('click', null);
      fixture.detectChanges();
    });

    const BUTTONS: Array<ButtonsConfig> = [
      {download: false, extUrl: false, close: false},
      {download: false, extUrl: false, close: true},
      {download: false, extUrl: true, close: false},
      {download: false, extUrl: true, close: false},
      {download: true, extUrl: false, close: false},
      {download: true, extUrl: false, close: true},
      {download: true, extUrl: true, close: false},
      {download: true, extUrl: true, close: true},
      {download: true, extUrl: true},
      {download: true},
      {extUrl: true},
      {close: false}
    ];

    IMAGES.forEach((img: Image, imgIndex: number) => {
      BUTTONS.forEach((btnConfig: ButtonsConfig, index: number) => {
        it(`should display the modal gallery (image with index=${imgIndex}) and check buttons visibility. Test i=${index}`, () => {
          const element: DebugElement = fixture.debugElement;
          updateInputsWithButtons(IMAGES, btnConfig);

          openModalGalleryByThumbIndex(imgIndex);
          testArrowsVisibility();
          // console.log(`Testing img`, img);
          // console.log(`Testing btnConfig`, btnConfig);
          let downloadBtn: DebugElement = element.query(By.css('a.download-image'));
          expect(downloadBtn).not.toBeUndefined();
          expect(downloadBtn.properties['hidden']).toBe(btnConfig.download === false || !btnConfig.download);
          let extUrlBtn: DebugElement = element.query(By.css('a.external-url-image'));
          expect(extUrlBtn).not.toBeUndefined();
          expect(extUrlBtn.properties['hidden']).toBe(btnConfig.extUrl === false || !IMAGES[imgIndex].extUrl || !btnConfig.extUrl);
          let closeBtn: DebugElement = element.query(By.css('a.close-popup'));
          expect(closeBtn).not.toBeUndefined();
          expect(closeBtn.properties['hidden']).toBe(btnConfig.close === false);
        });
      });
    });

    it('should display the modal gallery and check for the loading output values', () => {
      const element: DebugElement = fixture.debugElement;
      let index: number = 0;

      comp.show.subscribe((out: ImageModalEvent) => {
        expect(out.action).toBe(Action.LOAD);
        expect(out.result).toBe(index + 1);
      });

      comp.hasData.subscribe((out: ImageModalEvent) => {
        expect(out.action).toBe(Action.LOAD);
        expect(out.result).toBeTruthy();
      });

      updateInputs(IMAGES);
      openModalGalleryByThumbIndex(index);
      testArrowsVisibility();

      const expectedDescription: string = `Image ${index + 1}/${IMAGES.length}` + (IMAGES[index].description ? ` - ${IMAGES[index].description}` : '');

      let infoText: DebugElement = element.query(By.css('span.info-text'));
      expect(infoText.nativeElement.textContent).toBe(expectedDescription);
      let galleryContent: DebugElement = element.query(By.css('.ng-gallery-content'));
      expect(galleryContent).not.toBeUndefined();
      let img: DebugElement = element.query(By.css('img.effect'));
      expect(img).not.toBeUndefined();
      expect(img.properties['src']).toBe(IMAGES[index].img);
      expect(img.properties['alt']).toBe(getAltDesc(IMAGES[index]));
    });

    it('should display the modal gallery and close it with the close button', () => {
      comp.close.subscribe((out: ImageModalEvent) => {
        expect(out.action).toBe(Action.NORMAL);
        expect(out.result).toBeTruthy();
      });

      updateInputs(IMAGES);
      openModalGalleryByThumbIndex(0);
      testArrowsVisibility();

      let closeBtn: DebugElement = fixture.debugElement.query(By.css('a.close-popup'));
      expect(closeBtn).not.toBeUndefined();
      closeBtn.triggerEventHandler('click', null);
    });

    it('(TODO) should display the modal gallery and navigate to an external website with the extUrl button', () => {
      updateInputs(IMAGES);
      comp.buttonsConfig = {extUrl: true};
      fixture.detectChanges();
      openModalGalleryByThumbIndex(0);
      testArrowsVisibility();

      let extUrlBtn: DebugElement = fixture.debugElement.query(By.css('a.external-url-image'));
      expect(extUrlBtn).not.toBeUndefined();
      // TODO find a way to test this scenario
      // at the moment angular-modal-gallery isn't emitting a Download event,
      // so I have to intercept the download operation performed by the browser (???)
      extUrlBtn.triggerEventHandler('click', null);
    });

    it('(TODO) should display the modal gallery and download the current image with the download button', () => {
      updateInputs(IMAGES);
      comp.downloadable = true;
      comp.buttonsConfig = {download: true};
      fixture.detectChanges();
      openModalGalleryByThumbIndex(0);
      testArrowsVisibility();

      let downloadBtn: DebugElement = fixture.debugElement.query(By.css('a.download-image'));
      expect(downloadBtn).not.toBeUndefined();
      // TODO find a way to test this scenario
      // at the moment angular-modal-gallery isn't emitting a Download event,
      // so I have to intercept the download operation performed by the browser (???)
      downloadBtn.triggerEventHandler('click', null);
    });

    IMAGES.forEach((val: Image, index: number) => {
      it(`should display the modal gallery and check for the DEFAULT description. Test i=${index}`, () => {
        updateInputs(IMAGES);
        openModalGalleryByThumbIndex(index);
        testArrowsVisibility();

        const expectedDescription: string = `Image ${index + 1}/${IMAGES.length}` + (IMAGES[index].description ? ` - ${IMAGES[index].description}` : '');
        let infoText: DebugElement = fixture.debugElement.query(By.css('span.info-text'));
        expect(infoText.nativeElement.textContent).toBe(expectedDescription);
        let img: DebugElement = fixture.debugElement.query(By.css('img.effect'));
        expect(img).not.toBeUndefined();
        expect(img.properties['src']).toBe(IMAGES[index].img);
        expect(img.properties['alt']).toBe(getAltDesc(IMAGES[index]));
      });
    });

    IMAGES.forEach((val: Image, index: number) => {
      it(`should display the modal gallery and check for the CUSTOM description. Test i=${index}`, () => {
        const customDesc =  {
          imageText: 'Look this image ',
          numberSeparator: ' of ',
          beforeTextDescription: ' => '
        };
        comp.description = customDesc;

        updateInputs(IMAGES);
        openModalGalleryByThumbIndex(index);
        testArrowsVisibility();

        const expectedDescription: string = `${customDesc.imageText}${index + 1}${customDesc.numberSeparator}${IMAGES.length}` +
          (IMAGES[index].description ? `${customDesc.beforeTextDescription}${IMAGES[index].description}` : '');

        let infoText: DebugElement = fixture.debugElement.query(By.css('span.info-text'));
        expect(infoText.nativeElement.textContent).toBe(expectedDescription);
        let img: DebugElement = fixture.debugElement.query(By.css('img.effect'));
        expect(img).not.toBeUndefined();
        expect(img.properties['src']).toBe(IMAGES[index].img);
        expect(img.properties['alt']).toBe(getAltDesc(IMAGES[index]));
      });
    });

    it(`should display the modal gallery and check for the FULL-CUSTOM description. It's the same for all input images`, () => {
      const fullCustomDesc = 'Custom description of the current visible image';
      comp.description = {customFullDescription: fullCustomDesc};

      updateInputs(IMAGES);
      openModalGalleryByThumbIndex(0);
      testArrowsVisibility();

      let infoText: DebugElement = fixture.debugElement.query(By.css('span.info-text'));
      expect(infoText.nativeElement.textContent).toBe(fullCustomDesc);
      let img: DebugElement = fixture.debugElement.query(By.css('img.effect'));
      expect(img).not.toBeUndefined();
      expect(img.properties['src']).toBe(IMAGES[0].img);
      expect(img.properties['alt']).toBe(getAltDesc(IMAGES[0]));
    });

    it('should display the modal gallery and close it with the clickOutside feature', () => {
      comp.enableCloseOutside = true;

      updateInputs(IMAGES);
      openModalGalleryByThumbIndex(0);
      testArrowsVisibility();

      let galleryContent: DebugElement = fixture.debugElement.query(By.css('#ng-gallery-content'));
      expect(galleryContent).not.toBeUndefined();

      // clicks 'outside' to close modal gallery
      let overlay: DebugElement = fixture.debugElement.query(By.css('div#ng-gallery-content.ng-gallery-content'));
      comp.close.subscribe((out: ImageModalEvent) => {
        expect(out.action).toBe(Action.CLICK);
        expect(out.result).toBeTruthy();
      });
      overlay.nativeElement.click(); // for this scenario use the native click
    });

    it('should display the modal gallery and navigate to the next image with a swipe action', () => {
      let index: number = 0;
      updateInputs(IMAGES);
      openModalGalleryByThumbIndex(index);
      fixture.detectChanges();
      testArrowsVisibility();

      comp.show.subscribe((out: ImageModalEvent) => {
        // out contains the result, i.e. image number and not the image index.
        // this is important, because clicking on thumb `0`, I'll receive `1` as a response.
        // imageNumber is the clicked image number (not index (0...), but number (1...)),
        // imageNumber + 1 is the next image index (because in this test I navigate to the next image
        const imageNumber: number = index + 1;
        expect((out.action === Action.SWIPE) || (out.action === Action.LOAD)).toBeTruthy();
        // FIXME please improve this
        expect((out.result === (imageNumber) || (out.result === (imageNumber + 1)))).toBeTruthy();
      });

      comp.swipe(index, 'swiperight');

      fixture.detectChanges();
    });

    it('should display the modal gallery and navigate to the previous image with a swipe action', () => {
      let index: number = 1;
      updateInputs(IMAGES);
      openModalGalleryByThumbIndex(index);
      fixture.detectChanges();
      testArrowsVisibility();

      comp.show.subscribe((out: ImageModalEvent) => {
        // out contains the result, i.e. image number and not the image index.
        // this is important, because clicking on thumb `0`, I'll receive `1` as a response.
        // imageNumber is the clicked image number (not index (0...), but number (1...)),
        // imageNumber + 1 is the next image index (because in this test I navigate to the next image
        const imageNumber: number = index + 1;
        expect((out.action === Action.SWIPE) || (out.action === Action.LOAD)).toBeTruthy();
        // FIXME please improve this
        expect((out.result === (imageNumber) || (out.result === (imageNumber - 1)))).toBeTruthy();
      });

      comp.swipe(index, 'swipeleft');

      fixture.detectChanges();
    });

    it('should display the modal gallery and navigate to the next image with KEYBOARD', () => {
      const element: DebugElement = fixture.debugElement;
      let index: number = 0;
      updateInputs(IMAGES);
      openModalGalleryByThumbIndex(index);
      fixture.detectChanges();
      testArrowsVisibility();

      comp.show.subscribe((out: ImageModalEvent) => {
        // out contains the result, i.e. image number and not the image index.
        // this is important, because clicking on thumb `0`, I'll receive `1` as a response.
        // imageNumber is the clicked image number (not index (0...), but number (1...)),
        // imageNumber + 1 is the next image index (because in this test I navigate to the next image
        const imageNumber: number = index + 1;
        expect((out.action === Action.KEYBOARD) || (out.action === Action.LOAD)).toBeTruthy();
        // FIXME please improve this
        expect((out.result === (imageNumber) || (out.result === (imageNumber + 1)))).toBeTruthy();
      });

      let event: Event = document.createEvent('Event');
      event['keyCode'] = Keyboard.RIGHT_ARROW;
      event.initEvent('keydown', true, false);
      document.dispatchEvent(event);

      fixture.detectChanges();
    });

    it('should display the modal gallery and navigate to the next image with KEYBOARD', () => {
      const element: DebugElement = fixture.debugElement;
      let index: number = 0;
      const rightArrowKey: number = 38;
      comp.keyboardConfig = {right: rightArrowKey};
      updateInputs(IMAGES);
      openModalGalleryByThumbIndex(index);
      fixture.detectChanges();
      testArrowsVisibility();

      comp.show.subscribe((out: ImageModalEvent) => {
        // out contains the result, i.e. image number and not the image index.
        // this is important, because clicking on thumb `0`, I'll receive `1` as a response.
        // imageNumber is the clicked image number (not index (0...), but number (1...)),
        // imageNumber + 1 is the next image index (because in this test I navigate to the next image
        const imageNumber: number = index + 1;
        expect((out.action === Action.KEYBOARD) || (out.action === Action.LOAD)).toBeTruthy();
        // FIXME please improve this
        expect((out.result === (imageNumber) || (out.result === (imageNumber + 1)))).toBeTruthy();
      });

      let event = document.createEvent('Event');
      event['keyCode'] = rightArrowKey;
      event.initEvent('keydown', true, false);
      document.dispatchEvent(event);

      fixture.detectChanges();
    });

    it('should display the modal gallery and navigate to the previous image with KEYBOARD', () => {
      let index: number = 1;
      updateInputs(IMAGES);
      openModalGalleryByThumbIndex(index);
      fixture.detectChanges();
      testArrowsVisibility();

      comp.show.subscribe((out: ImageModalEvent) => {
        // out contains the result, i.e. image number and not the image index.
        // this is important, because clicking on thumb `0`, I'll receive `1` as a response.
        // imageNumber is the clicked image number (not index (0...), but number (1...)),
        // imageNumber + 1 is the next image index (because in this test I navigate to the next image
        const imageNumber: number = index + 1;
        expect((out.action === Action.KEYBOARD) || (out.action === Action.LOAD)).toBeTruthy();
        // FIXME please improve this
        expect((out.result === (imageNumber) || (out.result === (imageNumber - 1)))).toBeTruthy();
      });

      let event = document.createEvent('Event');
      event['keyCode'] = Keyboard.LEFT_ARROW;
      event.initEvent('keydown', true, false);
      document.dispatchEvent(event);

      fixture.detectChanges();
    });

    it('should display the modal gallery and navigate to the previous image with CUSTOM-KEYBOARD', () => {
      let index: number = 1;
      const leftArrowKey: number = 40;
      comp.keyboardConfig = {left: leftArrowKey};
      updateInputs(IMAGES);
      openModalGalleryByThumbIndex(index);
      fixture.detectChanges();
      testArrowsVisibility();

      comp.show.subscribe((out: ImageModalEvent) => {
        // out contains the result, i.e. image number and not the image index.
        // this is important, because clicking on thumb `0`, I'll receive `1` as a response.
        // imageNumber is the clicked image number (not index (0...), but number (1...)),
        // imageNumber + 1 is the next image index (because in this test I navigate to the next image
        const imageNumber: number = index + 1;
        expect((out.action === Action.KEYBOARD) || (out.action === Action.LOAD)).toBeTruthy();
        // FIXME please improve this
        expect((out.result === (imageNumber) || (out.result === (imageNumber - 1)))).toBeTruthy();
      });

      let event = document.createEvent('Event');
      event['keyCode'] = leftArrowKey;
      event.initEvent('keydown', true, false);
      document.dispatchEvent(event);

      fixture.detectChanges();
    });

    it('should display the modal gallery and close it with KEYBOARD', () => {
      let index: number = 0;
      updateInputs(IMAGES);
      openModalGalleryByThumbIndex(index);
      fixture.detectChanges();
      testArrowsVisibility();

      comp.close.subscribe((out: ImageModalEvent) => {
        expect(out.action).toBe(Action.KEYBOARD);
        expect(out.result).toBeTruthy();
      });

      let event = document.createEvent('Event');
      event['keyCode'] = Keyboard.ESC;
      event.initEvent('keydown', true, false);
      document.dispatchEvent(event);

      fixture.detectChanges();
    });

    it('should display the first image of the modal gallery without infinite sliding, blocking navigation over boundaries', () => {
      let index: number = 0;
      const leftArrowKey: number = 40;
      comp.keyboardConfig = {left: leftArrowKey};
      comp.slideConfig = {infinite: false};
      updateInputs(IMAGES);
      openModalGalleryByThumbIndex(index);
      fixture.detectChanges();
      testArrowVisibilityNoInfiniteSlidingBegin();

      comp.show.subscribe((out: ImageModalEvent) => {
        // because navigation to the previous image is blocked by slideConfig = {infinite: false};
        fail();
      });

      let event = document.createEvent('Event');
      event['keyCode'] = leftArrowKey;
      event.initEvent('keydown', true, false);
      document.dispatchEvent(event);

      fixture.detectChanges();
    });

    it('should display the last image of the modal gallery without infinite sliding, blocking navigation over boundaries', () => {
      let index: number = IMAGES.length - 1;
      const rightArrowKey: number = 38;
      comp.keyboardConfig = {right: rightArrowKey};
      comp.slideConfig = {infinite: false};
      updateInputs(IMAGES);
      openModalGalleryByThumbIndex(index);
      fixture.detectChanges();
      testArrowVisibilityNoInfiniteSlidingEnd();

      comp.show.subscribe((out: ImageModalEvent) => {
        // because navigation to the next image is blocked by slideConfig = {infinite: false};
        fail();
      });

      let event = document.createEvent('Event');
      event['keyCode'] = rightArrowKey;
      event.initEvent('keydown', true, false);
      document.dispatchEvent(event);

      fixture.detectChanges();
    });

    // TODO This feature will be deprecated ad removed sooner or later, so don't loose your time with this test
    IMAGES.forEach((val: Image, index: number) => {
      it(`(to deprecate) should display the modal gallery after a click on the item with index=${index} of the thumbs gallery with IMAGE POINTER (Array)`, () => {
        comp.show.subscribe((out: ImageModalEvent) => {
          expect(out.action).toBe(Action.LOAD);
          expect(out.result).toBe(comp.imagePointer + 1);

          expect(comp.currentImageIndex).toBe(comp.imagePointer);
          expect(comp.showGallery).toBeFalsy();
          expect(comp.opened).toBeTruthy();

          // FIXME these should be 0. It's correct to see all images instead of the '+' button
          // because I'm testing only this component, and the '+' button in defined by users outside (in their templates).
          // So this library will add all elements, but their will be not visible.
          // To do this test, I should use a Test component to include the library, but it's not really important
          // let imgs: DebugElement[] = fixture.debugElement.queryAll(By.css('img.ng-thumb'));
          // expect(imgs.length).toBe(IMAGES.length);

          fixture.detectChanges();
          testArrowsVisibility();
        });

        updateInputs(IMAGES);
        comp.imagePointer = index; // value used in this test to open an image
        comp.opened = false;
        comp.showGallery = false;
        comp.ngOnInit();
        fixture.detectChanges();
      });
    });
  });

  describe('---NO---', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should display the gallery without thumbs', () => {
      updateInputs([]);
      // gallery of thumbs is visible
      let imgs: DebugElement[] = fixture.debugElement.queryAll(By.css('img.ng-thumb'));
      expect(imgs.length).toBe(0);
    });


    const CUSTOM_DESC: Array<Description> = [
      { imageText: 'Look here ', beforeTextDescription: ' => '},
      // { imageText: 'Look here ', numberSeparator: ' of '},
      // { numberSeparator: ' of ', beforeTextDescription: ' => '}
    ];

    it('should try to close modal gallery with KEYBOARD, but modal gallery is closed', () => {
      // this will give me a test case with opeed = false
      // at the beginning of onKeyDown(e: KeyboardEvent)

      updateInputs(IMAGES);
      fixture.detectChanges();

      comp.close.subscribe((out: ImageModalEvent) => {
        fail('modal gallery is already closed, so this event should not be emitted');
      });

      let event = document.createEvent('Event');
      event['keyCode'] = Keyboard.ESC;
      event.initEvent('keydown', true, false);
      document.dispatchEvent(event);

      fixture.detectChanges();
    });

    it('(TODO) should display the modal gallery, but it CANNOT download the current image with the download button', () => {
      // in this scenario you can use ctrl+s
      updateInputs(IMAGES);
      comp.downloadable = true;
      comp.buttonsConfig = {download: false};
      fixture.detectChanges();
      openModalGalleryByThumbIndex(0);
      testArrowsVisibility();
      // let downloadBtn: DebugElement = fixture.debugElement.query(By.css('a.download-image'));
      // expect(downloadBtn).not.toBeUndefined();
      // TODO find a way to test this scenario
      // downloadBtn.triggerEventHandler('click', null);
    });

    it('should display the modal gallery, but it CANNOT download any image', () => {
      updateInputs(IMAGES);
      comp.downloadable = false;
      comp.buttonsConfig = {download: true};
      fixture.detectChanges();
      openModalGalleryByThumbIndex(0);
      testArrowsVisibility();
      comp.downloadImage();
    });
  });
});

function openModalGalleryByThumbIndex(index: number = 0) {
  let imgs: DebugElement[] = fixture.debugElement.queryAll(By.css('img.ng-thumb'));
  expect(imgs.length).toBe(IMAGES.length);
  imgs[index].triggerEventHandler('click', null);
  fixture.detectChanges();
}

function testArrowsVisibility() {
  let right: DebugElement = fixture.debugElement.query(By.css('a.nav-right'));
  expect(right.children[0].attributes['class']).toBe('fa fa-angle-right');

  let left: DebugElement = fixture.debugElement.query(By.css('a.nav-left'));
  expect(left.children[0].attributes['class']).toBe('fa fa-angle-left');
}

function testArrowVisibilityNoInfiniteSlidingBegin() {
  let right: DebugElement = fixture.debugElement.query(By.css('a.nav-right'));
  expect(right.children[0].attributes['class']).toBe('fa fa-angle-right');
  let left: DebugElement = fixture.debugElement.query(By.css('a.nav-left'));
  expect(left.properties['hidden']).toBe(true);
}

function testArrowVisibilityNoInfiniteSlidingEnd() {
  let right: DebugElement = fixture.debugElement.query(By.css('a.nav-right'));
  expect(right.properties['hidden']).toBe(true);
  let left: DebugElement = fixture.debugElement.query(By.css('a.nav-left'));
  expect(left.children[0].attributes['class']).toBe('fa fa-angle-left');
}

function updateInputs(images: Array<Image> | Observable<Array<Image>>) {
  comp.modalImages = images;
  fixture.detectChanges();
  comp.ngOnInit();
  fixture.detectChanges();
}

function updateInputsWithButtons(images: Array<Image> | Observable<Array<Image>>, buttonConfig: ButtonsConfig) {
  // init these before updateInputs(IMAGES);
  comp.downloadable = true;
  comp.buttonsConfig = buttonConfig;
  fixture.detectChanges();
  // now call updateInputs (remember to init `buttonsConfig`)
  updateInputs(images);
}

function getAltDesc(currentImage: Image) {
  if (!currentImage) {
    return '';
  }
  if (!currentImage.description) {
    return `Image ${comp.images.indexOf(currentImage)}`;
  }
  return currentImage.description;
}
