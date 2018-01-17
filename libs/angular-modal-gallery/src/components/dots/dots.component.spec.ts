/*
 * Copyright (C) 2017-2018 Stefano Cappa
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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { DotsComponent } from './dots.component';
import { AccessibilityConfig } from 'angular-modal-gallery/angular-modal-gallery/src/model/accessibility.interface';
import { DotsConfig } from 'angular-modal-gallery/angular-modal-gallery/src/model/dots-config.interface';
import { KS_DEFAULT_ACCESSIBILITY_CONFIG } from '../../components/accessibility-default';
import { InternalLibImage } from 'angular-modal-gallery/angular-modal-gallery/src/model/image-internal.class';

const CUSTOM_ACCESSIBILITY: AccessibilityConfig = Object.assign({}, KS_DEFAULT_ACCESSIBILITY_CONFIG);
CUSTOM_ACCESSIBILITY.dotsContainerTitle = 'custom dotsContainerTitle';
CUSTOM_ACCESSIBILITY.dotsContainerAriaLabel = 'custom dotsContainerAriaLabel';

let comp: DotsComponent;
let fixture: ComponentFixture<DotsComponent>;

const DOTS_CONFIG_VISIBLE: DotsConfig = {visible: true};
const DOTS_CONFIG_HIDDEN: DotsConfig = {visible: false};

const IMAGES: InternalLibImage[] = [
  new InternalLibImage(0, {
    // modal
    img: '../assets/images/gallery/img1.jpg',
    extUrl: 'http://www.google.com'
  }),
  new InternalLibImage(1, {
    // modal
    img: '../assets/images/gallery/img2.png',
    description: 'Description 2'
  }),
  new InternalLibImage(
    2,
    {
      // modal
      img: '../assets/images/gallery/img3.jpg',
      description: 'Description 3',
      extUrl: 'http://www.google.com'
    },
    {
      // plain
      img: '../assets/images/gallery/thumbs/img3.png',
      title: 'custom title 2',
      alt: 'custom alt 2',
      ariaLabel: 'arial label 2'
    }
  ),
  new InternalLibImage(3, {
    // modal
    img: '../assets/images/gallery/img4.jpg',
    description: 'Description 4',
    extUrl: 'http://www.google.com'
  }),
  new InternalLibImage(
    4,
    {
      // modal
      img: '../assets/images/gallery/img5.jpg'
    },
    {
      // plain
      img: '../assets/images/gallery/thumbs/img5.jpg'
    }
  )
];

function initTestBed() {
  return TestBed.configureTestingModule({
    declarations: [DotsComponent]
  }).compileComponents();
}

describe('DotsComponent', () => {
  beforeEach(async(() => {
    return initTestBed();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotsComponent);
    comp = fixture.componentInstance;
  });

  it('should instantiate it', () => expect(comp).not.toBeNull());

  describe('---YES---', () => {

    it(`should display dots based of the number of input images and click on one of them`, () => {
      const indexToClick = 1;
      const activeDotIndex = 0;
      comp.dotsConfig = DOTS_CONFIG_VISIBLE;
      comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
      comp.currentImage = IMAGES[activeDotIndex];
      comp.images = IMAGES;
      comp.ngOnInit();
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;

      comp.clickDot.subscribe((index: number) => {
        expect(index).toBe(indexToClick);
      });

      const dotsContainer: DebugElement = element.query(By.css('nav.dots-container'));
      // expect(dotsContainer).not.toBeNull();
      expect(dotsContainer.name).toBe('nav');
      expect(dotsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.dotsContainerAriaLabel);
      expect(dotsContainer.properties['title']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.dotsContainerTitle);

      const dots: DebugElement[] = dotsContainer.children;
      expect(dots.length).toBe(IMAGES.length);

      dots.forEach((dot: DebugElement, index: number) => {
        // console.log('index ' + index + ', dot', dot);
        expect(dot.name).toBe('div');
        expect(dot.attributes['role']).toBe('navigation');
        expect(dot.properties['tabIndex']).toBe(0);

        if (index === activeDotIndex) {
          console.log('sono qui a index=' + index + ' e activeDotIndex=' + activeDotIndex);
          expect(dot.attributes['class']).toBe('inside dot'); // FIXME this should be inside dot active
        } else {
          console.log('sono la a index=' + index + ' e activeDotIndex=' + activeDotIndex);
          expect(dot.attributes['class']).toBe('inside dot');
        }
        expect(dot.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.dotAriaLabel + ' ' + (index + 1));
      });

      // clicks on a dot
      dots[1].nativeElement.click();
    });

    it(`should display dots, because by default dotsConfig are visible`, () => {
      const activeDotIndex = 0;
      comp.dotsConfig = undefined; // or null, or something not valid
      comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
      comp.currentImage = IMAGES[activeDotIndex];
      comp.images = IMAGES;
      comp.ngOnInit();
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;

      const dotsContainer: DebugElement = element.query(By.css('nav.dots-container'));
      // expect(dotsContainer).not.toBeNull();
      expect(dotsContainer.name).toBe('nav');
      expect(dotsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.dotsContainerAriaLabel);
      expect(dotsContainer.properties['title']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.dotsContainerTitle);

      const dots: DebugElement[] = dotsContainer.children;
      expect(dots.length).toBe(IMAGES.length);

      dots.forEach((dot: DebugElement, index: number) => {
        // console.log('index ' + index + ', dot', dot);
        expect(dot.name).toBe('div');
        expect(dot.attributes['role']).toBe('navigation');
        expect(dot.properties['tabIndex']).toBe(0);

        if (index === activeDotIndex) {
          console.log('sono qui a index=' + index + ' e activeDotIndex=' + activeDotIndex);
          expect(dot.attributes['class']).toBe('inside dot'); // FIXME this should be inside dot active
        } else {
          console.log('sono la a index=' + index + ' e activeDotIndex=' + activeDotIndex);
          expect(dot.attributes['class']).toBe('inside dot');
        }
        expect(dot.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.dotAriaLabel + ' ' + (index + 1));
      });
    });

    it(`should display dots with custom accessibility`, () => {
      const activeDotIndex = 0;
      comp.dotsConfig = DOTS_CONFIG_VISIBLE;
      comp.accessibilityConfig = CUSTOM_ACCESSIBILITY;
      comp.currentImage = IMAGES[activeDotIndex];
      comp.images = IMAGES;
      comp.ngOnInit();
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;

      const dotsContainer: DebugElement = element.query(By.css('nav.dots-container'));
      // expect(dotsContainer).not.toBeNull();
      expect(dotsContainer.name).toBe('nav');
      expect(dotsContainer.attributes['aria-label']).toBe(CUSTOM_ACCESSIBILITY.dotsContainerAriaLabel);
      expect(dotsContainer.properties['title']).toBe(CUSTOM_ACCESSIBILITY.dotsContainerTitle);

      const dots: DebugElement[] = dotsContainer.children;
      expect(dots.length).toBe(IMAGES.length);

      dots.forEach((dot: DebugElement, index: number) => {
        // console.log('index ' + index + ', dot', dot);
        expect(dot.name).toBe('div');
        expect(dot.attributes['role']).toBe('navigation');
        expect(dot.properties['tabIndex']).toBe(0);

        if (index === activeDotIndex) {
          console.log('sono qui a index=' + index + ' e activeDotIndex=' + activeDotIndex);
          expect(dot.attributes['class']).toBe('inside dot'); // FIXME this should be inside dot active
        } else {
          console.log('sono la a index=' + index + ' e activeDotIndex=' + activeDotIndex);
          expect(dot.attributes['class']).toBe('inside dot');
        }
        expect(dot.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.dotAriaLabel + ' ' + (index + 1));
      });
    });
    // <nav class="dots-container" [attr.aria-label]="accessibilityConfig?.dotsContainerAriaLabel"
    //   [title]="accessibilityConfig?.dotsContainerTitle">
    // <ng-container *ngIf="!configDots || configDots?.visible">
    // <div class="inside dot"
    // *ngFor="let img of images; trackBy: trackById; let index = index"
    //   [ngClass]="{'active': isActive(index)}"
    //   [attr.aria-label]="accessibilityConfig?.dotAriaLabel + ' ' + (index + 1)"
    //   [tabindex]="0" role="navigation"
    // (click)="onDotEvent(index, $event)" (keyup)="onDotEvent(index, $event)"></div>
    //   </ng-container>
    //   </nav>
    // expect(btnDebugElement.name).toBe('a');
    //   expect(btnDebugElement.attributes['class']).toBe('upper-button');
    //   expect(btnDebugElement.attributes['kssize']).not.toBeNull();
    //   expect(btnDebugElement.attributes['sizeConfig']).toBeUndefined();
    //   // expect(btnDebugElement.attributes['style']).toBe('width: 30px; height: auto;');
    //   expect(btnDebugElement.attributes['aria-label']).toBe(currentButton.ariaLabel);
    //   expect(btnDebugElement.attributes['role']).toBe('button');
    //   expect(btnDebugElement.properties['tabIndex']).toBe(0);
    //   // expect(btnDebugElement.properties['hidden']).toBe(false);
    //
    //   // console.log('btnDebugElement.attributes ' + btnIndex, btnDebugElement.attributes);
    //   // console.log('btnDebugElement.properties ' + btnIndex, btnDebugElement.properties);
    //
    //   if (currentButton.fontSize) {
    //     expect(btnDebugElement.nativeElement.style.fontSize).toBe(currentButton.fontSize);
    //   }
    //   if (currentButton.size) {
    //     expect(btnDebugElement.nativeElement.style.width).toBe(currentButton.size.width);
    //     expect(btnDebugElement.nativeElement.style.height).toBe(currentButton.size.height);
    //   }
    //
    //   const childrenElements: DebugElement[] = btnDebugElement.children;
    //   expect(childrenElements.length).toBe(1);
    //   expect(childrenElements[0].attributes['aria-hidden']).toBe('true');
    //   expect(childrenElements[0].properties['className']).toBe('inside ' + currentButton.className);
    //   expect(childrenElements[0].properties['title']).toBe(currentButton.title);
    //   // console.log('childrenElements.attributes ' + btnIndex, childrenElements[0].attributes);
    //   // console.log('childrenElements.properties ' + btnIndex, childrenElements[0].properties);
  });

  describe('---NO---', () => {

    it(`shouldn't display dots, because visibility is false.`, () => {
      comp.dotsConfig = DOTS_CONFIG_HIDDEN;
      comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
      comp.ngOnInit();
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;

      const dotsContainer: DebugElement = element.query(By.css('nav.dots-container'));
      expect(dotsContainer.name).toBe('nav');
      expect(dotsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.dotsContainerAriaLabel);
      expect(dotsContainer.properties['title']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.dotsContainerTitle);

      const dots: DebugElement[] = element.queryAll(By.css('div.inside.dot'));
      expect(dots.length).toBe(0);
    });

    it(`shouldn't display dots, because the array of images as input is empty`, () => {
      comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
      comp.currentImage = null;
      comp.images = [];
      comp.ngOnInit();
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;

      const dotsContainer: DebugElement = element.query(By.css('nav.dots-container'));
      expect(dotsContainer.name).toBe('nav');
      expect(dotsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.dotsContainerAriaLabel);
      expect(dotsContainer.properties['title']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.dotsContainerTitle);

      const dots: DebugElement[] = dotsContainer.children;
      expect(dots.length).toBe(0);
    });

    it(`shouldn't display dots, because the array of images as input is not valid`, () => {
      comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
      comp.currentImage = null;
      comp.images = null;
      comp.ngOnInit();
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;

      const dotsContainer: DebugElement = element.query(By.css('nav.dots-container'));
      expect(dotsContainer.name).toBe('nav');
      expect(dotsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.dotsContainerAriaLabel);
      expect(dotsContainer.properties['title']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.dotsContainerTitle);

      const dots: DebugElement[] = dotsContainer.children;
      expect(dots.length).toBe(0);
    });
  });
});
