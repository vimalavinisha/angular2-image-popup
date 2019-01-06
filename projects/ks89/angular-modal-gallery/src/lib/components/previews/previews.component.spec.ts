/*
 * Copyright (c) 2017-2019 Stefano Cappa
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

import 'hammerjs';
import 'mousetrap';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, SimpleChanges } from '@angular/core';
import { By } from '@angular/platform-browser';

import { AccessibilityConfig } from '../../model/accessibility.interface';
import { KS_DEFAULT_ACCESSIBILITY_CONFIG } from '../../components/accessibility-default';
import { InternalLibImage } from '../../model/image-internal.class';
import { PreviewsComponent } from './previews.component';
import { PreviewConfig } from '../../model/preview-config.interface';
import { SlideConfig } from '../../model/slide-config.interface';
import { Size } from '../../model/size.interface';
import { ImageModalEvent, ModalImage, PlainImage } from '../../model/image.class';
import { SizeDirective } from '../../directives/size.directive';
import { KS_DEFAULT_SIZE } from '../upper-buttons/upper-buttons-default';
import { Action } from '../../model/action.enum';

interface NavigationTestData {
  initial: {
    start: number,
    end: number,
    activeIndex: number
  };
  expected: {
    start: number,
    end: number,
    activeIndex: number
  };
}

let comp: PreviewsComponent;
let fixture: ComponentFixture<PreviewsComponent>;

const CUSTOM_ACCESSIBILITY: AccessibilityConfig = Object.assign({}, KS_DEFAULT_ACCESSIBILITY_CONFIG);
CUSTOM_ACCESSIBILITY.previewsContainerAriaLabel = 'custom previewsContainerAriaLabel';
CUSTOM_ACCESSIBILITY.previewsContainerTitle = 'custom previewsContainerTitle';
CUSTOM_ACCESSIBILITY.previewScrollNextAriaLabel = 'custom previewScrollNextAriaLabel';
CUSTOM_ACCESSIBILITY.previewScrollNextTitle = 'custom previewScrollNextTitle';
CUSTOM_ACCESSIBILITY.previewScrollPrevAriaLabel = 'custom previewScrollPrevAriaLabel';
CUSTOM_ACCESSIBILITY.previewScrollPrevTitle = 'custom previewScrollPrevTitle';

const DEFAULT_PREVIEW_SIZE: Size = {height: '50px', width: 'auto'};
const CUSTOM_SIZE: Size = {height: '40px', width: '40px'};
const CUSTOM_SIZE_AUTO_HEIGHT: Size = {height: 'auto', width: '40px'};
const CUSTOM_SIZE_AUTO_WIDTH: Size = {height: '40px', width: 'auto'};
const CUSTOM_SIZES: Size[] = [CUSTOM_SIZE, CUSTOM_SIZE_AUTO_HEIGHT, CUSTOM_SIZE_AUTO_WIDTH];

const PREVIEWS_CONFIG_VISIBLE: PreviewConfig = {visible: true};
const SLIDE_CONFIG_INFINITE: SlideConfig = {infinite: true};
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

const IMAGES_CUSTOM_ACCESSIBILITY: InternalLibImage[] = IMAGES.map((image: InternalLibImage) => {
  const newImage: InternalLibImage = Object.assign({}, image);
  newImage.modal.title = 'custom accessibility title';
  newImage.modal.alt = 'custom accessibility alt';
  newImage.modal.ariaLabel = 'custom accessibility ariaLabel';
  return newImage;
});

const NAVIGATION_NEXT_PREVIEWS: NavigationTestData[] = [
  {
    initial: {start: 0, end: 3, activeIndex: 0},
    expected: {start: 1, end: 4, activeIndex: 0}
  },
  {
    initial: {start: 1, end: 4, activeIndex: 0},
    expected: {start: 2, end: 5, activeIndex: 0}
  }
];

const NAVIGATION_PREV_PREVIEWS: NavigationTestData[] = [
  {
    initial: {start: 2, end: 5, activeIndex: 0},
    expected: {start: 1, end: 4, activeIndex: 0}
  },
  {
    initial: {start: 1, end: 4, activeIndex: 0},
    expected: {start: 0, end: 3, activeIndex: 0}
  }
];

function checkArrows(arrows: DebugElement[], first: boolean, last: boolean,
                     accessibility: AccessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG) {
  const prevArrowClass = first ? 'inside empty-arrow-preview-image' : 'inside left-arrow-preview-image';
  const nextArrowClass = last ? 'inside empty-arrow-preview-image' : 'inside right-arrow-preview-image';
  expect(arrows.length).toBe(2);
  expect(arrows[0].attributes['class']).toBe('nav-left');
  expect(arrows[0].attributes['role']).toBe('button');
  expect(arrows[0].attributes['aria-label']).toBe(accessibility.previewScrollPrevAriaLabel);
  expect(arrows[0].properties['tabIndex']).toBe(first ? -1 : 0); // because with the first image, prev arrow is hidden
  expect(arrows[0].children[0].attributes['aria-hidden']).toBe('true');
  expect(arrows[0].children[0].properties['title']).toBe(accessibility.previewScrollPrevTitle);
  expect(arrows[0].children[0].properties['className']).toBe(prevArrowClass); // 'inside left-arrow-preview-image');
  expect(arrows[1].attributes['class']).toBe('nav-right');
  expect(arrows[1].attributes['role']).toBe('button');
  expect(arrows[1].attributes['aria-label']).toBe(accessibility.previewScrollNextAriaLabel);
  expect(arrows[1].properties['tabIndex']).toBe(last ? -1 : 0);
  expect(arrows[1].children[0].attributes['aria-hidden']).toBe('true');
  expect(arrows[1].children[0].properties['title']).toBe(accessibility.previewScrollNextTitle);
  expect(arrows[1].children[0].properties['className']).toBe(nextArrowClass);
}

function checkPreview(previewElement: DebugElement, previewImage: InternalLibImage, isActive: boolean, size: Size = DEFAULT_PREVIEW_SIZE) {
  const currentPlainImg: PlainImage = previewImage.plain;
  const currentModalImg: ModalImage = previewImage.modal;
  expect(previewElement.name).toBe('img');
  expect(previewElement.attributes['role']).toBe('img');
  expect(previewElement.attributes['aria-label']).toBe(currentModalImg.ariaLabel ? currentModalImg.ariaLabel : '');
  expect(previewElement.attributes['ksSize']).toBe('');
  expect(previewElement.styles.width).toBe(size.width);
  expect(previewElement.styles.height).toBe(size.height);
  // console.log('previewElement.properties[\'className\']', previewElement);
  // expect(previewElement.properties['className']).toBe('inside preview-image ' + (isActive ? 'active' : ''));
  expect(previewElement.properties['src']).toBe(currentPlainImg && currentPlainImg.img ? currentPlainImg.img : currentModalImg.img);
  expect(previewElement.properties['title']).toBe(currentModalImg.title ? currentModalImg.title : '');
  expect(previewElement.properties['alt']).toBe(currentModalImg.alt ? currentModalImg.alt : '');
  expect(previewElement.properties['tabIndex']).toBe(0);
  // expect(previewElement.properties['className']).toBe('inside preview-image ' + (isActive ? 'active' : ''));
}

function checkPreviewStateAfterClick(previews: DebugElement[], prevValue: InternalLibImage, currValue: InternalLibImage,
                                     start: number, end: number, activeIndex: number = 0) {
  fixture.detectChanges();
  // comp.ngOnChanges(<SimpleChanges>{
  //   currentImage: {
  //     previousValue: prevValue,
  //     currentValue: currValue,
  //     firstChange: false,
  //     isFirstChange: () => false
  //   }
  // });
  // console.log('[[[[[[[[[[[ s', start);
  // console.log('[[[[[[[[[[[ cs', comp.start);
  // console.log('[[[[[[[[[[[ e', end);
  // console.log('[[[[[[[[[[[ ce', comp.end);
  // console.log('[[[[[[[[[[[ activeIndex', activeIndex);
  // console.log('[[[[[[[[[[[ ???', IMAGES.slice(start, end));
  expect(comp.start).toBe(start);
  expect(comp.end).toBe(end);
  expect(comp.previews).toEqual(IMAGES.slice(start, end));
}

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

    it(`should display previews (first one is active) based of input images`, () => {
      const initialActiveImage = 0;
      const numOfPreviews = 3;
      comp.previewConfig = PREVIEWS_CONFIG_VISIBLE;
      comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
      comp.currentImage = IMAGES[initialActiveImage];
      comp.images = IMAGES;
      comp.slideConfig = SLIDE_CONFIG;
      comp.ngOnInit();
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;

      const arrows: DebugElement[] = element.queryAll(By.css('a'));
      checkArrows(arrows, true, false);

      const previewsContainer: DebugElement = element.query(By.css('nav.previews-container'));
      expect(previewsContainer.name).toBe('nav');
      expect(previewsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerAriaLabel);
      expect(previewsContainer.properties['title']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerTitle);

      const previews: DebugElement[] = element.queryAll(By.css('img'));
      expect(previews.length).toBe(numOfPreviews);

      const previewImages: InternalLibImage[] = IMAGES.slice(initialActiveImage, numOfPreviews);

      for (let i = 0; i < previewImages.length; i++) {
        checkPreview(previews[i], previewImages[i], i === 0, DEFAULT_PREVIEW_SIZE);
      }
    });

    it(`should display previews (one in the middle is active) based of input images`, () => {
      // in this example I choose the third image (index = 2) as the current one
      const initialActiveImage = 2; // you can use every value except for 0 and the last one
      const numOfPreviews = 3;
      comp.previewConfig = PREVIEWS_CONFIG_VISIBLE;
      comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
      comp.currentImage = IMAGES[initialActiveImage];
      comp.images = IMAGES;
      comp.slideConfig = SLIDE_CONFIG;
      comp.ngOnInit();
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;

      const arrows: DebugElement[] = element.queryAll(By.css('a'));
      checkArrows(arrows, false, false);

      const previewsContainer: DebugElement = element.query(By.css('nav.previews-container'));
      expect(previewsContainer.name).toBe('nav');
      expect(previewsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerAriaLabel);
      expect(previewsContainer.properties['title']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerTitle);

      const previews: DebugElement[] = element.queryAll(By.css('img'));
      expect(previews.length).toBe(numOfPreviews);

      const previewImages: InternalLibImage[] = IMAGES.slice(initialActiveImage - 1, initialActiveImage - 1 + numOfPreviews);

      for (let i = 0; i < previewImages.length; i++) {
        checkPreview(previews[i], previewImages[i], i === 1, DEFAULT_PREVIEW_SIZE);
      }
    });

    it(`should display previews (last one is active) based of input images`, () => {
      // in this example I choose the last image as the current one
      const initialActiveImage = IMAGES.length - 1;
      const numOfPreviews = 3;
      comp.previewConfig = PREVIEWS_CONFIG_VISIBLE;
      comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
      comp.currentImage = IMAGES[initialActiveImage];
      comp.images = IMAGES;
      comp.slideConfig = SLIDE_CONFIG;
      comp.ngOnInit();
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;

      const arrows: DebugElement[] = element.queryAll(By.css('a'));
      checkArrows(arrows, false, true);

      const previewsContainer: DebugElement = element.query(By.css('nav.previews-container'));
      expect(previewsContainer.name).toBe('nav');
      expect(previewsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerAriaLabel);
      expect(previewsContainer.properties['title']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerTitle);

      const previews: DebugElement[] = element.queryAll(By.css('img'));
      expect(previews.length).toBe(numOfPreviews);

      const previewImages: InternalLibImage[] = IMAGES.slice(initialActiveImage + 1 - numOfPreviews, initialActiveImage + 1);

      for (let i = 0; i < previewImages.length; i++) {
        checkPreview(previews[i], previewImages[i], i === 2, DEFAULT_PREVIEW_SIZE);
      }
    });

    it(`should display previews with custom accessibility`, () => {
      const initialActiveImage = 0;
      const numOfPreviews = 3;
      comp.previewConfig = PREVIEWS_CONFIG_VISIBLE;
      // custom accessibility for container and arrows, but not for previews
      comp.accessibilityConfig = CUSTOM_ACCESSIBILITY;
      comp.currentImage = IMAGES_CUSTOM_ACCESSIBILITY[initialActiveImage];
      // provide custom accessibility in ModalImage
      comp.images = IMAGES_CUSTOM_ACCESSIBILITY;
      comp.slideConfig = SLIDE_CONFIG;
      comp.ngOnInit();
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;

      const arrows: DebugElement[] = element.queryAll(By.css('a'));
      checkArrows(arrows, true, false, CUSTOM_ACCESSIBILITY);

      const previewsContainer: DebugElement = element.query(By.css('nav.previews-container'));
      expect(previewsContainer.name).toBe('nav');
      expect(previewsContainer.attributes['aria-label']).toBe(CUSTOM_ACCESSIBILITY.previewsContainerAriaLabel);
      expect(previewsContainer.properties['title']).toBe(CUSTOM_ACCESSIBILITY.previewsContainerTitle);

      const previews: DebugElement[] = element.queryAll(By.css('img'));
      expect(previews.length).toBe(numOfPreviews);

      const previewImages: InternalLibImage[] = IMAGES.slice(initialActiveImage, numOfPreviews);

      for (let i = 0; i < previewImages.length; i++) {
        checkPreview(previews[i], previewImages[i], i === 0, DEFAULT_PREVIEW_SIZE);
      }
    });

    it(`should display a custom number of previews without navigation arrows`, () => {
      const initialActiveImage = 0;
      const numOfPreviews = 2;
      comp.previewConfig = {visible: true, number: 2, arrows: false};
      comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
      comp.currentImage = IMAGES[initialActiveImage];
      comp.images = IMAGES;
      comp.slideConfig = SLIDE_CONFIG;
      comp.ngOnInit();
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;

      const arrows: DebugElement[] = element.queryAll(By.css('a'));
      expect(arrows.length).toBe(2);
      checkArrows(arrows, true, true);

      const previewsContainer: DebugElement = element.query(By.css('nav.previews-container'));
      expect(previewsContainer.name).toBe('nav');
      expect(previewsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerAriaLabel);
      expect(previewsContainer.properties['title']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerTitle);

      const previews: DebugElement[] = element.queryAll(By.css('img'));
      expect(previews.length).toBe(numOfPreviews);

      const previewImages: InternalLibImage[] = IMAGES.slice(initialActiveImage, numOfPreviews);

      for (let i = 0; i < previewImages.length; i++) {
        checkPreview(previews[i], previewImages[i], i === 0, DEFAULT_PREVIEW_SIZE);
      }
    });

    CUSTOM_SIZES.forEach((size: Size, index: number) => {
      it(`should display previews with custom sizes. Index i=${index}`, () => {
        const initialActiveImage = 0;
        const numOfPreviews = 3;
        comp.previewConfig = {visible: true, size: size};
        comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
        comp.currentImage = IMAGES[initialActiveImage];
        comp.images = IMAGES;
        comp.slideConfig = SLIDE_CONFIG;
        comp.ngOnInit();
        fixture.detectChanges();

        const element: DebugElement = fixture.debugElement;

        const arrows: DebugElement[] = element.queryAll(By.css('a'));
        checkArrows(arrows, true, false);

        const previewsContainer: DebugElement = element.query(By.css('nav.previews-container'));
        expect(previewsContainer.name).toBe('nav');
        expect(previewsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerAriaLabel);
        expect(previewsContainer.properties['title']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerTitle);

        const previews: DebugElement[] = element.queryAll(By.css('img'));
        expect(previews.length).toBe(numOfPreviews);

        const previewImages: InternalLibImage[] = IMAGES.slice(initialActiveImage, numOfPreviews);

        for (let i = 0; i < previewImages.length; i++) {
          checkPreview(previews[i], previewImages[i], i === 0, size);
        }
      });
    });

    it(`should display previews (first one is active) and click on the second one`, () => {
      const initialActiveImage = 0;
      const numOfPreviews = 3;
      const afterClickActivePreview = 0;
      comp.previewConfig = PREVIEWS_CONFIG_VISIBLE;
      comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
      comp.currentImage = IMAGES[initialActiveImage];
      comp.images = IMAGES;
      comp.slideConfig = SLIDE_CONFIG;
      comp.ngOnInit();
      fixture.detectChanges();

      comp.clickPreview.subscribe((res: ImageModalEvent) => {
        const event: ImageModalEvent = new ImageModalEvent(Action.CLICK, afterClickActivePreview);
        expect(res).toEqual(event);
      });

      const element: DebugElement = fixture.debugElement;

      const arrows: DebugElement[] = element.queryAll(By.css('a'));
      checkArrows(arrows, true, false);

      const previews: DebugElement[] = element.queryAll(By.css('img'));
      expect(previews.length).toBe(numOfPreviews);

      const previewImages: InternalLibImage[] = IMAGES.slice(initialActiveImage, numOfPreviews);

      for (let i = 0; i < previewImages.length; i++) {
        checkPreview(previews[i], previewImages[i], i === 0, DEFAULT_PREVIEW_SIZE);
      }

      previews[afterClickActivePreview].nativeElement.click();
    });

    // TODO
    // it(`should display previews (first one is active) and go to the second one with keyboard`, () => {
    //   const initialActivePreview = 0;
    //   const afterClickActivePreview = 0;
    //   const numberOfVisiblePreviews = 3;
    //   comp.previewConfig = PREVIEWS_CONFIG_VISIBLE;
    //   comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
    //   comp.currentImage = IMAGES[initialActivePreview];
    //   comp.images = IMAGES;
    //   comp.slideConfig = SLIDE_CONFIG;
    //   comp.ngOnInit();
    //   fixture.detectChanges();
    //
    //   comp.clickPreview.subscribe((res: InternalLibImage) => {
    //     console.log('----- comp.clickPreview.subscribe' + res, IMAGES[afterClickActivePreview]);
    //     fail('I should go here');
    //     expect(res).toEqual(IMAGES[afterClickActivePreview]);
    //   });
    //
    //   const element: DebugElement = fixture.debugElement;
    //
    //   const arrows: DebugElement[] = element.queryAll(By.css('a'));
    //   checkArrows(arrows, true, false);
    //
    //   const previews: DebugElement[] = element.queryAll(By.css('img'));
    //   expect(previews.length).toBe(numberOfVisiblePreviews);
    //
    //   previews.forEach((preview: DebugElement, index: number) => {
    //     checkPreviewDefault(preview, initialActivePreview, index);
    //   });
    //
    //   previews[afterClickActivePreview].nativeElement.focus();
    //   previews[afterClickActivePreview].triggerEventHandler('keyup', <KeyboardEvent>{keyCode: 32});
    //   fixture.detectChanges();
    // });

    NAVIGATION_NEXT_PREVIEWS.forEach((val: NavigationTestData, index: number) => {
      it(`should navigate previews clicking on left arrow. Test i=${index}`, async(() => {
        comp.previewConfig = PREVIEWS_CONFIG_VISIBLE;
        comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
        comp.currentImage = IMAGES[val.initial.activeIndex];
        comp.images = IMAGES;
        comp.slideConfig = SLIDE_CONFIG;
        comp.ngOnInit();
        fixture.detectChanges();

        const element: DebugElement = fixture.debugElement;

        const previews: DebugElement[] = element.queryAll(By.css('img'));
        expect(previews.length).toBe(3);

        const arrows: DebugElement[] = element.queryAll(By.css('a'));
        expect(arrows.length).toBe(2);

        spyOn(comp, 'onNavigationEvent').and.callThrough();

        if (index !== 0) {
          arrows[1].nativeElement.click();
          fixture.detectChanges();
        }

        expect(comp.start).toBe(val.initial.start);
        expect(comp.end).toBe(val.initial.end);
        expect(comp.previews).toEqual(IMAGES.slice(val.initial.start, val.initial.end));

        if (index === 0) {
          checkArrows(arrows, true, false);
        } else {
          checkArrows(arrows, false, false);
        }

        arrows[1].nativeElement.click();

        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(comp.onNavigationEvent).toHaveBeenCalled();
          expect(comp.start).toBe(val.expected.start);
          expect(comp.end).toBe(val.expected.end);
          expect(comp.previews).toEqual(IMAGES.slice(val.expected.start, val.expected.end));
          if (index === 0) {
            checkArrows(arrows, false, false);
          } else {
            checkArrows(arrows, false, true);
          }
        });
      }));
    });

    // TODO
    // NAVIGATION_PREV_PREVIEWS.forEach((val: NavigationTestData, index: number) => {
    //   it(`should navigate back previews clicking on right arrow. Test i=${index}`, async(() => {
    //     comp.previewConfig = PREVIEWS_CONFIG_VISIBLE;
    //     comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
    //     comp.currentImage = IMAGES[val.initial.activeIndex];
    //     comp.images = IMAGES;
    //     comp.slideConfig = SLIDE_CONFIG;
    //     comp.ngOnInit();
    //     fixture.detectChanges();
    //
    //     const element: DebugElement = fixture.debugElement;
    //
    //     const previews: DebugElement[] = element.queryAll(By.css('img'));
    //     expect(previews.length).toBe(3);
    //
    //     const arrows: DebugElement[] = element.queryAll(By.css('a'));
    //     expect(arrows.length).toBe(2);
    //
    //     spyOn(comp, 'onNavigationEvent').and.callThrough();
    //
    //     if (index !== 0) {
    //       arrows[0].nativeElement.click();
    //       fixture.detectChanges();
    //     }
    //
    //     expect(comp.start).toBe(val.initial.start);
    //     expect(comp.end).toBe(val.initial.end);
    //     expect(comp.previews).toEqual(IMAGES.slice(val.initial.start, val.initial.end));
    //
    //     if (index === 0) {
    //       checkArrows(arrows, false, true);
    //     } else {
    //       checkArrows(arrows, false, false);
    //     }
    //
    //     arrows[0].nativeElement.click();
    //
    //     fixture.whenStable().then(() => {
    //       fixture.detectChanges();
    //       expect(comp.onNavigationEvent).toHaveBeenCalled();
    //       expect(comp.start).toBe(val.expected.start);
    //       expect(comp.end).toBe(val.expected.end);
    //       expect(comp.previews).toEqual(IMAGES.slice(val.expected.start, val.expected.end));
    //       if (index === 0) {
    //         checkArrows(arrows, false, false);
    //       } else {
    //         checkArrows(arrows, true, false);
    //       }
    //     });
    //   }));
    // });

    [SLIDE_CONFIG, SLIDE_CONFIG_INFINITE].forEach((slideConfig: SlideConfig, index: number) => {
      it(`should navigate next/prev clicking on images for all SlideConfigs. Test i=${index}`, async(() => {
        comp.previewConfig = PREVIEWS_CONFIG_VISIBLE;
        comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
        comp.currentImage = IMAGES[0];
        comp.images = IMAGES;
        comp.slideConfig = slideConfig;
        comp.ngOnInit();
        fixture.detectChanges();

        const element: DebugElement = fixture.debugElement;

        let previews: DebugElement[] = element.queryAll(By.css('img'));
        expect(previews.length).toBe(3);

        const arrows: DebugElement[] = element.queryAll(By.css('a'));
        expect(arrows.length).toBe(2);

        spyOn(comp, 'onImageEvent').and.callThrough();

        let images: InternalLibImage[];

        // this should change the current preview triggering ngOnChanges to navigate next/prev
        // however this is a unit testing and I cannot use modal-gallery.component,
        // so I have to simulate this behaviour manually
        previews[0].nativeElement.click();
        checkPreviewStateAfterClick(previews, IMAGES[0], IMAGES[0], 0, 3, 0);
        images = IMAGES.slice(0, 3);
        for (let i = 0; i < images.length; i++) {
          checkPreview(previews[i], images[i], i === 0, DEFAULT_PREVIEW_SIZE);
        }

        fixture.detectChanges();

        previews = element.queryAll(By.css('img'));

        previews[1].nativeElement.click();
        checkPreviewStateAfterClick(previews, IMAGES[0], IMAGES[1], 0, 3, 1);
        // images = IMAGES.slice(0, 3);
        // for (let i = 0; i < images.length; i++) {
        //   checkPreview(previews[i], images[i], i === 1, DEFAULT_PREVIEW_SIZE);
        // }
        // images = IMAGESò.slice(1, 4);
        // for (let i = 0; i < images.length; i++) {
        //   console.log('previews[i] ', previews[i].properties['className']);
        //   console.log('images[i] ', images[i]);
        //   checkPreview(previews[i], images[i], i === 2, DEFAULT_PREVIEW_SIZE);
        // }
        previews = element.queryAll(By.css('img'));
        fixture.detectChanges();
        // previews[2].nativeElement.click();
        comp.ngOnChanges(<SimpleChanges>{
          currentImage: {
            previousValue: IMAGES[1],
            currentValue: IMAGES[2],
            firstChange: false,
            isFirstChange: () => false
          }
        });
        checkPreviewStateAfterClick(previews, IMAGES[1], IMAGES[2], 1, 4, 2);

        previews = element.queryAll(By.css('img'));
        fixture.detectChanges();
        // previews[2].nativeElement.click();
        comp.ngOnChanges(<SimpleChanges>{
          currentImage: {
            previousValue: IMAGES[3],
            currentValue: IMAGES[4],
            firstChange: false,
            isFirstChange: () => false
          }
        });
        checkPreviewStateAfterClick(previews, IMAGES[3], IMAGES[4], 2, 5, 4);

        previews = element.queryAll(By.css('img'));
        fixture.detectChanges();
        previews[2].nativeElement.click();
        checkPreviewStateAfterClick(previews, IMAGES[4], IMAGES[4], 2, 5, 5);
      }));
    });
  });

  describe('---NO---', () => {
    it(`shouldn't display previews because visibility is false`, () => {
      comp.previewConfig = PREVIEWS_CONFIG_HIDDEN;
      comp.currentImage = IMAGES[0];
      comp.images = IMAGES;
      comp.ngOnInit();
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;

      const arrows: DebugElement[] = element.queryAll(By.css('a'));
      expect(arrows.length).toBe(0);

      const previewsContainer: DebugElement = element.query(By.css('nav.previews-container'));
      expect(previewsContainer.name).toBe('nav');
      // null because input accessibility is not provided in this test
      expect(previewsContainer.attributes['aria-label']).toBeNull();
      expect(previewsContainer.properties['title']).toBeNull();

      const previews: DebugElement[] = element.queryAll(By.css('img'));
      expect(previews.length).toBe(0);
    });
  });
});
