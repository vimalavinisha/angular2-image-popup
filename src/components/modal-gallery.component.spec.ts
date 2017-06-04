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

import { AngularModalGalleryComponent, Image } from './modal-gallery.component';
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

    it('should display the gallery ad the modal gallery after a click ob a thumb', () => {
      updateInputs(IMAGES);

      const element: DebugElement = fixture.debugElement;

      let index: number = 2;

      comp.opened = false;
      comp.showGallery = true;

      fixture.detectChanges();

      let imgs: DebugElement[] = element.queryAll(By.css('img.ng-thumb'));
      expect(imgs.length).toBe(IMAGES.length);

      expect(comp.opened).toBeFalsy();

      imgs[index].triggerEventHandler('click', null);

      fixture.detectChanges();

      expect(comp.opened).toBeTruthy();
    });

    it('should display the modal gallery', () => {
      updateInputs(IMAGES);

      const element: DebugElement = fixture.debugElement;

      let index: number = 2;
      comp.showModalGallery(index);

      fixture.detectChanges();

      let right: DebugElement = element.query(By.css('a.nav-right'));
      expect(right.children[0].attributes.class).toBe('fa fa-angle-right');

      let left: DebugElement = element.query(By.css('a.nav-left'));
      expect(left.children[0].attributes.class).toBe('fa fa-angle-left');

      let infoText: DebugElement = element.query(By.css('span.info-text'));
      expect(infoText.nativeElement.textContent).toBe(`Image ${index + 1}/${IMAGES.length} - ${IMAGES[index].description}`);

      let galleryContent: DebugElement = element.query(By.css('.ng-gallery-content'));
      expect(galleryContent).not.toBeUndefined();

      let downloadBtn: DebugElement = element.query(By.css('a.download-image'));
      expect(downloadBtn).not.toBeUndefined();

      let extUrlBtn: DebugElement = element.query(By.css('a.external-url-image'));
      expect(extUrlBtn).not.toBeUndefined();

      let closeBtn: DebugElement = element.query(By.css('a.close-popup'));
      expect(closeBtn).not.toBeUndefined();

      let img: DebugElement = element.query(By.css('img.effect'));
      expect(img).not.toBeUndefined();
      expect(img.properties.src).toBe(IMAGES[index].img);
      expect(img.properties.alt).toBe(IMAGES[index].description);

      // let loading: DebugElement = element.query(By.css('div.uil-ring-css'));
      // expect(loading).not.toBeUndefined();
    });
  });
});

function updateInputs(images: Array<Image>) {
  comp.images = images;
  fixture.detectChanges();
}
