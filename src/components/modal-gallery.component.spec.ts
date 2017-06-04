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

import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import {Action, AngularModalGalleryComponent, ButtonsConfig, Image, ImageModalEvent} from './modal-gallery.component';
import { KeyboardService } from './keyboard.service';
import { UpperButtonsComponent } from './upper-buttons.component';
import { GalleryComponent } from './gallery.component';
import { CloseButtonDirective } from '../directives/close-button.directive';
import { ExternalUrlButtonDirective } from '../directives/external-url-button.directive';
import { DownloadButtonDirective } from '../directives/download-button.directive';
import { ClickOutsideDirective } from '../directives/click-outside.directive';

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
        {provide: KeyboardService, useClass: KeyboardService}
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
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should display the gallery of thumbs with a single element', () => {
      updateInputs([IMAGES[0]]);
      comp.opened = false;
      comp.showGallery = true;
      fixture.detectChanges();
      // gallery of thumbs is visible
      let imgs: DebugElement[] = fixture.debugElement.queryAll(By.css('img.ng-thumb'));
      expect(imgs.length).toBe(1);
      // modal gallery not visible
      expect(comp.opened).toBeFalsy();
    });

    it('should display the gallery of thumbs with some elements', () => {
      updateInputs(IMAGES);
      comp.opened = false;
      comp.showGallery = true;
      fixture.detectChanges();
      // gallery of thumbs is visible
      let imgs: DebugElement[] = fixture.debugElement.queryAll(By.css('img.ng-thumb'));
      expect(imgs.length).toBe(IMAGES.length);
      // modal gallery not visible
      expect(comp.opened).toBeFalsy();
    });

    IMAGES.forEach((val: Image, index: number) => {
      it(`should display the modal gallery after a click on the thumb with index=${index}`, () => {
        updateInputs(IMAGES);
        const element: DebugElement = fixture.debugElement;
        comp.opened = false;
        comp.showGallery = true;
        fixture.detectChanges();
        // gallery of thumbs is visible
        let imgs: DebugElement[] = element.queryAll(By.css('img.ng-thumb'));
        expect(imgs.length).toBe(IMAGES.length);
        // modal gallery not visible
        expect(comp.opened).toBeFalsy();
        // click on a thumb to open the gallery
        imgs[index].triggerEventHandler('click', null);
        fixture.detectChanges();
        // not, modal gallery should be opened
        expect(comp.opened).toBeTruthy();
        testArrowsVisibility();
      });
    });

    it('should display the modal gallery and navigate to the first image', () => {
      updateInputs(IMAGES);
      const element: DebugElement = fixture.debugElement;
      comp.opened = false;
      comp.showGallery = true;
      fixture.detectChanges();

      comp.showModalGallery(1);

      fixture.detectChanges();
      testArrowsVisibility();

      // first image
      comp.firstImage.subscribe((out: ImageModalEvent) => {
        expect(out.action).toBe(Action.NORMAL);
        expect(out.result).toBeTruthy();
      });

      let left: DebugElement = element.query(By.css('a.nav-left'));
      left.triggerEventHandler('click', null);
      fixture.detectChanges();
    });

    it('should display the modal gallery and navigate to the first image from the end', () => {
      updateInputs(IMAGES);
      const element: DebugElement = fixture.debugElement;
      comp.opened = false;
      comp.showGallery = true;
      fixture.detectChanges();

      comp.showModalGallery(IMAGES.length - 1);

      fixture.detectChanges();
      testArrowsVisibility();

      // first image
      comp.firstImage.subscribe((out: ImageModalEvent) => {
        expect(out.action).toBe(Action.NORMAL);
        expect(out.result).toBeTruthy();
      });

      let right: DebugElement = element.query(By.css('a.nav-right'));
      right.triggerEventHandler('click', null);
      fixture.detectChanges();
    });

    it('should display the modal gallery and navigate to the last image', () => {
      updateInputs(IMAGES);
      const element: DebugElement = fixture.debugElement;
      comp.opened = false;
      comp.showGallery = true;
      fixture.detectChanges();

      comp.showModalGallery(IMAGES.length - 2);

      fixture.detectChanges();
      testArrowsVisibility();

      // last image
      comp.lastImage.subscribe((out: ImageModalEvent) => {
        expect(out.action).toBe(Action.NORMAL);
        expect(out.result).toBeTruthy();
      });

      let right: DebugElement = element.query(By.css('a.nav-right'));
      right.triggerEventHandler('click', null);
      fixture.detectChanges();
    });

    it('should display the modal gallery and navigate to the last image from the beginning', () => {
      updateInputs(IMAGES);
      const element: DebugElement = fixture.debugElement;
      comp.opened = false;
      comp.showGallery = true;
      fixture.detectChanges();

      comp.showModalGallery(0);

      fixture.detectChanges();
      testArrowsVisibility();

      // last image
      comp.lastImage.subscribe((out: ImageModalEvent) => {
        expect(out.action).toBe(Action.NORMAL);
        expect(out.result).toBeTruthy();
      });

      let left: DebugElement = element.query(By.css('a.nav-left'));
      left.triggerEventHandler('click', null);
      fixture.detectChanges();
    });


    const BUTTONS: Array<ButtonsConfig> = [
      {download: false, extUrl: false, close: false},
      // {download: false, extUrl: false, close: true},
      // {download: false, extUrl: true, close: false},
      // {download: false, extUrl: true, close: true},
      // {download: true, extUrl: false, close: false},
      // {download: true, extUrl: false, close: true},
      // {download: true, extUrl: true, close: false},
      // {download: true, extUrl: true, close: true},
      // // {download: true, extUrl: true},
      // // {download: true},
      // // {extUrl: true},
      // // {close: false}
    ];

    BUTTONS.forEach((val: ButtonsConfig, index: number) => {
      it(`(FIXME) should display the modal gallery and check buttons visibility. Test i=${index}`, () => {
        updateInputs(IMAGES);
        comp.buttonsConfig = val;
        fixture.detectChanges();
        const element: DebugElement = fixture.debugElement;
        comp.showModalGallery(0);
        fixture.detectChanges();
        testArrowsVisibility();
        let downloadBtn: DebugElement = element.query(By.css('a.download-image'));
        expect(downloadBtn).not.toBeUndefined();
        expect(downloadBtn.properties.hidden).toBe(val.download === false);
        let extUrlBtn: DebugElement = element.query(By.css('a.external-url-image'));
        expect(extUrlBtn).not.toBeUndefined();
        expect(extUrlBtn.properties.hidden).toBe(val.extUrl === false);
        // let closeBtn: DebugElement = element.query(By.css('a.close-popup'));
        // expect(closeBtn).not.toBeUndefined();
        // expect(closeBtn.properties.hidden).toBe(val.close === false);
      });
    });

    it('should display the modal gallery and check for the output values', () => {
      updateInputs(IMAGES);
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

      comp.showModalGallery(index);

      fixture.detectChanges();
      testArrowsVisibility();

      const expectedDescription: string = `Image ${index + 1}/${IMAGES.length}` + (IMAGES[index].description ? ` - ${IMAGES[index].description}` : '');

      let infoText: DebugElement = element.query(By.css('span.info-text'));
      expect(infoText.nativeElement.textContent).toBe(expectedDescription);
      let galleryContent: DebugElement = element.query(By.css('.ng-gallery-content'));
      expect(galleryContent).not.toBeUndefined();
      let img: DebugElement = element.query(By.css('img.effect'));
      expect(img).not.toBeUndefined();
      expect(img.properties['src']).toBe(IMAGES[index].img);
      expect(img.properties['alt']).toBe(IMAGES[index].description ? IMAGES[index].description : '');

      // next image, clicking on the image
      // comp.show.subscribe((out: ImageModalEvent) => {
      //   console.log('click out', out);
      // //   expect(out.action).toBe(Action.CLICK);
      // //   expect(out.result).toBe(index + 2);
      // });

      // img.triggerEventHandler('click', null);
      // fixture.detectChanges();


      // let loading: DebugElement = element.query(By.css('div.uil-ring-css'));
      // expect(loading).not.toBeUndefined();
    });

    it('should display the modal gallery and close it with the close button', () => {
      updateInputs(IMAGES);
      const element: DebugElement = fixture.debugElement;
      let index: number = 0;
      comp.showModalGallery(index);
      fixture.detectChanges();
      let closeBtn: DebugElement = element.query(By.css('a.close-popup'));
      expect(closeBtn).not.toBeUndefined();
      comp.close.subscribe((out: ImageModalEvent) => {
        expect(out.action).toBe(Action.NORMAL);
        expect(out.result).toBeTruthy();
      });
      closeBtn.triggerEventHandler('click', null);
    });

    it('(TODO) should display the modal gallery and navigate to an external website with the extUrl button', () => {
      updateInputs(IMAGES);
      comp.buttonsConfig = {extUrl: true};
      const element: DebugElement = fixture.debugElement;
      let index: number = 0;
      comp.showModalGallery(index);
      fixture.detectChanges();
      let extUrlBtn: DebugElement = element.query(By.css('a.external-url-image'));
      expect(extUrlBtn).not.toBeUndefined();
      // TODO find a way to test this scenario
    });

    it('(TODO) should display the modal gallery and download the current image with the download button', () => {
      updateInputs(IMAGES);
      comp.downloadable = true;
      comp.buttonsConfig = {download: true};
      const element: DebugElement = fixture.debugElement;
      let index: number = 0;
      comp.showModalGallery(index);
      fixture.detectChanges();
      let downloadBtn: DebugElement = element.query(By.css('a.download-image'));
      expect(downloadBtn).not.toBeUndefined();
      // TODO find a way to test this scenario
    });

    IMAGES.forEach((val: Image, index: number) => {
      it(`should display the modal gallery and check for the DEFAULT description. Test i=${index}`, () => {
        updateInputs(IMAGES);
        const element: DebugElement = fixture.debugElement;
        comp.showModalGallery(index);
        fixture.detectChanges();
        testArrowsVisibility();
        const expectedDescription: string = `Image ${index + 1}/${IMAGES.length}` + (IMAGES[index].description ? ` - ${IMAGES[index].description}` : '');
        let infoText: DebugElement = element.query(By.css('span.info-text'));
        expect(infoText.nativeElement.textContent).toBe(expectedDescription);
        let img: DebugElement = element.query(By.css('img.effect'));
        expect(img).not.toBeUndefined();
        expect(img.properties['src']).toBe(IMAGES[index].img);
        expect(img.properties['alt']).toBe(IMAGES[index].description ? IMAGES[index].description : '');
      });
    });

    IMAGES.forEach((val: Image, index: number) => {
      it(`should display the modal gallery and check for the CUSTOM description. Test i=${index}`, () => {
        updateInputs(IMAGES);
        const customDesc =  {
          imageText: 'Look this image ',
          numberSeparator: ' of ',
          beforeTextDescription: ' => '
        };
        comp.description = customDesc;
        const element: DebugElement = fixture.debugElement;
        comp.showModalGallery(index);
        fixture.detectChanges();
        testArrowsVisibility();
        const expectedDescription: string = `${customDesc.imageText}${index + 1}${customDesc.numberSeparator}${IMAGES.length}` + (IMAGES[index].description ? `${customDesc.beforeTextDescription}${IMAGES[index].description}` : '');
        let infoText: DebugElement = element.query(By.css('span.info-text'));
        expect(infoText.nativeElement.textContent).toBe(expectedDescription);
        let img: DebugElement = element.query(By.css('img.effect'));
        expect(img).not.toBeUndefined();
        expect(img.properties['src']).toBe(IMAGES[index].img);
        expect(img.properties['alt']).toBe(IMAGES[index].description ? IMAGES[index].description : '');
      });
    });

    it(`should display the modal gallery and check for the FULL-CUSTOM description. It's the same for all input images`, () => {
      updateInputs(IMAGES);
      const fullCustomDesc = 'Custom description of the current visible image';
      comp.description = {customFullDescription: fullCustomDesc};
      const element: DebugElement = fixture.debugElement;
      comp.showModalGallery(0);
      fixture.detectChanges();
      testArrowsVisibility();
      let infoText: DebugElement = element.query(By.css('span.info-text'));
      expect(infoText.nativeElement.textContent).toBe(fullCustomDesc);
      let img: DebugElement = element.query(By.css('img.effect'));
      expect(img).not.toBeUndefined();
      expect(img.properties['src']).toBe(IMAGES[0].img);
      expect(img.properties['alt']).toBe(IMAGES[0].description ? IMAGES[0].description : '');
    });

    it('should display the modal gallery and close it with the clickOutside feature', () => {
      updateInputs(IMAGES);
      comp.enableCloseOutside = true;
      fixture.detectChanges();
      const element: DebugElement = fixture.debugElement;
      comp.showModalGallery(0);
      fixture.detectChanges();
      testArrowsVisibility();
      let galleryContent: DebugElement = element.query(By.css('#ng-gallery-content'));
      expect(galleryContent).not.toBeUndefined();
      fixture.detectChanges();

      // clicks 'outside' to close modal gallery
      let overlay: DebugElement = fixture.debugElement.query(By.css('div#ng-gallery-content.ng-gallery-content'));
      comp.close.subscribe((out: ImageModalEvent) => {
        expect(out.action).toBe(Action.CLICK);
        expect(out.result).toBeTruthy();
      });
      overlay.nativeElement.click(); // for this scenario use the native click
    });
  });

  describe('---NO---', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should display the gallery without thumbs', () => {});

    it('(TODO) should display the modal gallery, but it CANNOT download the current image with the download button', () => {
      updateInputs(IMAGES);
      comp.downloadable = true; // no downloadable at all
      comp.buttonsConfig = {download: true};
      let index: number = 0;
      comp.showModalGallery(index);
      fixture.detectChanges();
      let downloadBtn: DebugElement = fixture.debugElement.query(By.css('a.download-image'));
      expect(downloadBtn).not.toBeUndefined();
      // TODO find a way to test this scenario
    });


  });

});


function testArrowsVisibility() {
  let right: DebugElement = fixture.debugElement.query(By.css('a.nav-right'));
  expect(right.children[0].attributes.class).toBe('fa fa-angle-right');

  let left: DebugElement = fixture.debugElement.query(By.css('a.nav-left'));
  expect(left.children[0].attributes.class).toBe('fa fa-angle-left');
}

function updateInputs(images: Array<Image>) {
  comp.images = images;
  fixture.detectChanges();
}
