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

import { AccessibilityConfig } from '../../model/accessibility.interface';
import { KS_DEFAULT_ACCESSIBILITY_CONFIG } from '../../components/accessibility-default';
import { InternalLibImage } from '../../model/image-internal.class';
import { PreviewsComponent } from './previews.component';
import { PreviewConfig } from '../../model/preview-config.interface';
import { SlideConfig } from '../../model/slide-config.interface';
import { Size } from '../../model/size.interface';
import { KS_DEFAULT_SIZE } from 'angular-modal-gallery/angular-modal-gallery';
import { SizeDirective } from '../../directives/size.directive';

const CUSTOM_ACCESSIBILITY: AccessibilityConfig = Object.assign({}, KS_DEFAULT_ACCESSIBILITY_CONFIG);
CUSTOM_ACCESSIBILITY.dotsContainerTitle = 'custom dotsContainerTitle';
CUSTOM_ACCESSIBILITY.dotsContainerAriaLabel = 'custom dotsContainerAriaLabel';

let comp: PreviewsComponent;
let fixture: ComponentFixture<PreviewsComponent>;

const CUSTOM_SIZE: Size = {height: '40px', width: '40px'};
const CUSTOM_SIZE_AUTO_HEIGHT: Size = {height: 'auto', width: '40px'};
const CUSTOM_SIZE_AUTO_WIDTH: Size = {height: '40px', width: 'auto'};

const PREVIEWS_CONFIG_VISIBLE: PreviewConfig = {visible: true};
const PREVIEWS_CONFIG_HIDDEN: PreviewConfig = {visible: false};

const SLIDE_CONFIG: SlideConfig = {infinite: false, sidePreviews: {show: true, size: KS_DEFAULT_SIZE}};


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
    declarations: [PreviewsComponent, SizeDirective]
  }).compileComponents();
}

describe('PreviewsComponent', () => {
  beforeEach(async(() => {
    return initTestBed();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewsComponent);
    comp = fixture.componentInstance;
  });

  it('should instantiate it', () => expect(comp).not.toBeNull());

  describe('---YES---', () => {

    it(`should display previews (first one is active) based of the input images`, () => {
      const initialActivePreview = 0;
      const afterClickActivePreview = 0;
      comp.previewConfig = PREVIEWS_CONFIG_VISIBLE;
      comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
      comp.currentImage = IMAGES[initialActivePreview];
      comp.images = IMAGES;
      comp.slideConfig = SLIDE_CONFIG;
      comp.ngOnInit();
      fixture.detectChanges();

      comp.clickPreview.subscribe((res: InternalLibImage) => {
        console.log(res, IMAGES[afterClickActivePreview]);
        expect(res).toEqual(IMAGES[afterClickActivePreview]);
      });

      const element: DebugElement = fixture.debugElement;

      const previewsContainer: DebugElement = element.query(By.css('nav.previews-container'));
      expect(previewsContainer.name).toBe('nav');
      expect(previewsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerAriaLabel);
      expect(previewsContainer.properties['title']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerTitle);

      const arrows: DebugElement[] = element.queryAll(By.css('a'));
      expect(arrows.length).toBe(2);
      expect(arrows[0].attributes['class']).toBe('nav-left');
      expect(arrows[0].attributes['role']).toBe('button');
      expect(arrows[0].attributes['aria-label']).toBe('Scroll previous previews');
      expect(arrows[0].properties['tabIndex']).toBe(-1); // because with the first image, prev arrow is hidden
      expect(arrows[0].children[0].attributes['aria-hidden']).toBe('true');
      // expect(arrows[0].children[0].classes).toBe('inside left-arrow-preview-image');
      expect(arrows[0].children[0].properties['title']).toBe('Scroll previous previews');
      expect(arrows[0].children[0].properties['className']).toBe('inside empty-arrow-preview-image'); // 'inside left-arrow-preview-image');

      expect(arrows[1].attributes['class']).toBe('nav-right');
      expect(arrows[1].attributes['role']).toBe('button');
      expect(arrows[1].attributes['aria-label']).toBe('Scroll next previews');
      expect(arrows[1].properties['tabIndex']).toBe(0);
      expect(arrows[1].children[0].attributes['aria-hidden']).toBe('true');
      expect(arrows[1].children[0].properties['className']).toBe('inside right-arrow-preview-image');
      expect(arrows[1].children[0].properties['title']).toBe('Scroll next previews');

      const previews: DebugElement[] = element.queryAll(By.css('img'));
      expect(previews.length).toBe(3);

      previews.forEach((preview: DebugElement, index: number) => {
        expect(preview.name).toBe('img');
        expect(preview.attributes['role']).toBe('img');
        expect(preview.attributes['aria-label']).toBe('');
        expect(preview.attributes['ksSize']).toBe('');

        expect(preview.properties['className']).toBe('inside preview-image ' + ((initialActivePreview === index) ? 'active' : ''));
        expect(preview.properties['src']).toBe(IMAGES[index].plain && IMAGES[index].plain.img ? IMAGES[index].plain.img : IMAGES[index].modal.img);
        expect(preview.properties['title']).toBe('');
        expect(preview.properties['alt']).toBe('');
        expect(preview.properties['tabIndex']).toBe(0);

        if (index === initialActivePreview) {
          expect(preview.properties['className']).toBe('inside preview-image active');
        } else {
          expect(preview.properties['className']).toBe('inside preview-image ');
        }
      });

      previews[afterClickActivePreview].nativeElement.click();
    });

    it(`should display previews (first one is active) based of the input images`, async(() => {
      const initialActivePreview = 0;
      const afterClickActivePreview = 0;
      comp.previewConfig = PREVIEWS_CONFIG_VISIBLE;
      comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
      comp.currentImage = IMAGES[initialActivePreview];
      comp.images = IMAGES;
      comp.slideConfig = SLIDE_CONFIG;
      comp.ngOnInit();
      fixture.detectChanges();

      // comp.clickPreview.subscribe((res: InternalLibImage) => {
      //   console.log(res, IMAGES[afterClickActivePreview]);
      //   expect(res).toEqual(IMAGES[afterClickActivePreview]);
      // });

      const element: DebugElement = fixture.debugElement;

      const previewsContainer: DebugElement = element.query(By.css('nav.previews-container'));
      expect(previewsContainer.name).toBe('nav');
      expect(previewsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerAriaLabel);
      expect(previewsContainer.properties['title']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerTitle);

      const arrows: DebugElement[] = element.queryAll(By.css('a'));
      expect(arrows.length).toBe(2);
      expect(arrows[0].attributes['class']).toBe('nav-left');
      expect(arrows[0].attributes['role']).toBe('button');
      expect(arrows[0].attributes['aria-label']).toBe('Scroll previous previews');
      expect(arrows[0].properties['tabIndex']).toBe(-1); // because with the first image, prev arrow is hidden
      expect(arrows[0].children[0].attributes['aria-hidden']).toBe('true');
      // expect(arrows[0].children[0].classes).toBe('inside left-arrow-preview-image');
      expect(arrows[0].children[0].properties['title']).toBe('Scroll previous previews');
      expect(arrows[0].children[0].properties['className']).toBe('inside empty-arrow-preview-image'); // 'inside left-arrow-preview-image');

      expect(arrows[1].attributes['class']).toBe('nav-right');
      expect(arrows[1].attributes['role']).toBe('button');
      expect(arrows[1].attributes['aria-label']).toBe('Scroll next previews');
      expect(arrows[1].properties['tabIndex']).toBe(0);
      expect(arrows[1].children[0].attributes['aria-hidden']).toBe('true');
      expect(arrows[1].children[0].properties['className']).toBe('inside right-arrow-preview-image');
      expect(arrows[1].children[0].properties['title']).toBe('Scroll next previews');

      // const previews: DebugElement[] = element.queryAll(By.css('img'));
      // expect(previews.length).toBe(3);
      //
      // previews.forEach((preview: DebugElement, index: number) => {
      //   expect(preview.name).toBe('img');
      //   expect(preview.attributes['role']).toBe('img');
      //   expect(preview.attributes['aria-label']).toBe('');
      //   expect(preview.attributes['ksSize']).toBe('');
      //
      //   expect(preview.properties['className']).toBe('inside preview-image ' + ((initialActivePreview === index) ? 'active' : ''));
      //   expect(preview.properties['src']).toBe(IMAGES[index].plain && IMAGES[index].plain.img ? IMAGES[index].plain.img : IMAGES[index].modal.img);
      //   expect(preview.properties['title']).toBe('');
      //   expect(preview.properties['alt']).toBe('');
      //   expect(preview.properties['tabIndex']).toBe(0);
      //
      //   if (index === initialActivePreview) {
      //     expect(preview.properties['className']).toBe('inside preview-image active');
      //   } else {
      //     expect(preview.properties['className']).toBe('inside preview-image ');
      //   }
      // });

      expect(comp.start).toBe(0);
      expect(comp.end).toBe(3);
      expect(comp.previews).toEqual(IMAGES.slice(0, 3));

      spyOn(comp, 'onNavigationEvent').and.callThrough();

      arrows[1].nativeElement.click();

      // let button = fixture.debugElement.nativeElement.querySelector('button');
      // button.click();

      fixture.whenStable().then(() => {
        console.log(']]]]]]]]]]]]]]');
        expect(comp.onNavigationEvent).toHaveBeenCalled();
        expect(comp.start).toBe(1);
        expect(comp.end).toBe(4);
        expect(comp.previews).toEqual(IMAGES.slice(1, 4));
      });
    }));

    // it(`should display dots (first one is active), because by default previewConfig are visible`, () => {
    //   const activeDotIndex = 0;
    //   comp.previewConfig = undefined; // or null, or something not valid
    //   comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
    //   comp.currentImage = IMAGES[activeDotIndex];
    //   comp.images = IMAGES;
    //   comp.ngOnInit();
    //   fixture.detectChanges();
    //
    //   const element: DebugElement = fixture.debugElement;
    //
    //   const dotsContainer: DebugElement = element.query(By.css('nav.dots-container'));
    //   expect(dotsContainer.name).toBe('nav');
    //   expect(dotsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.dotsContainerAriaLabel);
    //   expect(dotsContainer.properties['title']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.dotsContainerTitle);
    //
    //   const dots: DebugElement[] = dotsContainer.children;
    //   expect(dots.length).toBe(IMAGES.length);
    //
    //   dots.forEach((dot: DebugElement, index: number) => {
    //     expect(dot.name).toBe('div');
    //     expect(dot.attributes['role']).toBe('navigation');
    //     expect(dot.properties['tabIndex']).toBe(0);
    //
    //     if (index === activeDotIndex) {
    //       // I don't know why, but with dot.attributes['class'] I can't see 'active'. In this way it's working!
    //       expect(dot.classes).toEqual({'inside': true, 'dot': true, 'active': true});
    //     } else {
    //       expect(dot.attributes['class']).toBe('inside dot');
    //       // or like above: expect(dot.classes).toEqual({'inside': true, 'dot': true});
    //     }
    //     expect(dot.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.dotAriaLabel + ' ' + (index + 1));
    //   });
    // });
    //
    // it(`should display dots (first one is active) with custom accessibility`, () => {
    //   const activeDotIndex = 0;
    //   comp.previewConfig = PREVIEWS_CONFIG_VISIBLE;
    //   comp.accessibilityConfig = CUSTOM_ACCESSIBILITY;
    //   comp.currentImage = IMAGES[activeDotIndex];
    //   comp.images = IMAGES;
    //   comp.ngOnInit();
    //   fixture.detectChanges();
    //
    //   const element: DebugElement = fixture.debugElement;
    //
    //   const dotsContainer: DebugElement = element.query(By.css('nav.dots-container'));
    //   expect(dotsContainer.name).toBe('nav');
    //   expect(dotsContainer.attributes['aria-label']).toBe(CUSTOM_ACCESSIBILITY.dotsContainerAriaLabel);
    //   expect(dotsContainer.properties['title']).toBe(CUSTOM_ACCESSIBILITY.dotsContainerTitle);
    //
    //   const dots: DebugElement[] = dotsContainer.children;
    //   expect(dots.length).toBe(IMAGES.length);
    //
    //   dots.forEach((dot: DebugElement, index: number) => {
    //     expect(dot.name).toBe('div');
    //     expect(dot.attributes['role']).toBe('navigation');
    //     expect(dot.properties['tabIndex']).toBe(0);
    //
    //     if (index === activeDotIndex) {
    //       // I don't know why, but with dot.attributes['class'] I can't see 'active'. In this way it's working!
    //       expect(dot.classes).toEqual({'inside': true, 'dot': true, 'active': true});
    //     } else {
    //       expect(dot.attributes['class']).toBe('inside dot');
    //       // or like above: expect(dot.classes).toEqual({'inside': true, 'dot': true});
    //     }
    //     expect(dot.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.dotAriaLabel + ' ' + (index + 1));
    //   });
    // });
    //
    // it(`should display dots and click on one of themem`, () => {
    //   const indexToClick = 1;
    //   const activeDotIndex = 0;
    //   comp.previewConfig = PREVIEWS_CONFIG_VISIBLE;
    //   comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
    //   comp.currentImage = IMAGES[activeDotIndex];
    //   comp.images = IMAGES;
    //   comp.ngOnInit();
    //   fixture.detectChanges();
    //
    //   const element: DebugElement = fixture.debugElement;
    //
    //   comp.clickPreview.subscribe((index: number) => {
    //     expect(index).toBe(indexToClick);
    //   }, () => fail('after a click I should receive a clickDot event'));
    //
    //   const dotsContainer: DebugElement = element.query(By.css('nav.dots-container'));
    //   expect(dotsContainer).not.toBeNull();
    //   const dots: DebugElement[] = dotsContainer.children;
    //   expect(dots.length).toBe(IMAGES.length);
    //
    //   // clicks on a dot
    //   dots[1].nativeElement.click();
    // });
  });

  // describe('---NO---', () => {
  //
  //   it(`shouldn't display dots, because visibility is false.`, () => {
  //     comp.previewConfig = PREVIEWS_CONFIG_HIDDEN;
  //     comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
  //     comp.ngOnInit();
  //     fixture.detectChanges();
  //
  //     const element: DebugElement = fixture.debugElement;
  //
  //     const dotsContainer: DebugElement = element.query(By.css('nav.dots-container'));
  //     expect(dotsContainer.name).toBe('nav');
  //     expect(dotsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.dotsContainerAriaLabel);
  //     expect(dotsContainer.properties['title']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.dotsContainerTitle);
  //
  //     const dots: DebugElement[] = element.queryAll(By.css('div.inside.dot'));
  //     expect(dots.length).toBe(0);
  //   });
  //
  //   it(`shouldn't display dots, because the array of images as input is empty`, () => {
  //     comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
  //     comp.currentImage = null;
  //     comp.images = [];
  //     comp.ngOnInit();
  //     fixture.detectChanges();
  //
  //     const element: DebugElement = fixture.debugElement;
  //
  //     const dotsContainer: DebugElement = element.query(By.css('nav.dots-container'));
  //     expect(dotsContainer.name).toBe('nav');
  //     expect(dotsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.dotsContainerAriaLabel);
  //     expect(dotsContainer.properties['title']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.dotsContainerTitle);
  //
  //     const dots: DebugElement[] = dotsContainer.children;
  //     expect(dots.length).toBe(0);
  //   });
  //
  //   it(`shouldn't display dots, because the array of images as input is not valid`, () => {
  //     comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
  //     comp.currentImage = null;
  //     comp.images = null;
  //     comp.ngOnInit();
  //     fixture.detectChanges();
  //
  //     const element: DebugElement = fixture.debugElement;
  //
  //     const dotsContainer: DebugElement = element.query(By.css('nav.dots-container'));
  //     expect(dotsContainer.name).toBe('nav');
  //     expect(dotsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.dotsContainerAriaLabel);
  //     expect(dotsContainer.properties['title']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.dotsContainerTitle);
  //
  //     const dots: DebugElement[] = dotsContainer.children;
  //     expect(dots.length).toBe(0);
  //   });
  //
  //   it(`shouldn't display active dot when the currentImage is invalid, because 'isActive' method throws a managed error and return false`, () => {
  //     comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
  //     comp.currentImage = new InternalLibImage(-1, null);
  //     comp.images = IMAGES;
  //     comp.ngOnInit();
  //     fixture.detectChanges();
  //
  //     const element: DebugElement = fixture.debugElement;
  //
  //     const dotsContainer: DebugElement = element.query(By.css('nav.dots-container'));
  //     expect(dotsContainer.name).toBe('nav');
  //     expect(dotsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.dotsContainerAriaLabel);
  //     expect(dotsContainer.properties['title']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.dotsContainerTitle);
  //
  //     const dots: DebugElement[] = dotsContainer.children;
  //     expect(dots.length).toBe(IMAGES.length);
  //
  //     // all dots are NOT active, bat simply 'inside dot'
  //     dots.forEach((dot: DebugElement, index: number) => {
  //       expect(dot.name).toBe('div');
  //       expect(dot.attributes['role']).toBe('navigation');
  //       expect(dot.properties['tabIndex']).toBe(0);
  //       expect(dot.attributes['class']).toBe('inside dot');
  //       expect(dot.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.dotAriaLabel + ' ' + (index + 1));
  //     });
  //   });
  // });
});
