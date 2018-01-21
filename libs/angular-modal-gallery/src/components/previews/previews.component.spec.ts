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
import { DebugElement, SimpleChanges } from '@angular/core';
import { By } from '@angular/platform-browser';

import { AccessibilityConfig } from '../../model/accessibility.interface';
import { KS_DEFAULT_ACCESSIBILITY_CONFIG } from '../../components/accessibility-default';
import { InternalLibImage } from '../../model/image-internal.class';
import { PreviewsComponent } from './previews.component';
import { PreviewConfig } from '../../model/preview-config.interface';
import { SlideConfig } from '../../model/slide-config.interface';
import { Size } from '../../model/size.interface';
import { ModalImage, PlainImage } from '../../model/image.class';
import { SizeDirective } from '../../directives/size.directive';
import { KS_DEFAULT_SIZE } from '../upper-buttons/upper-buttons-default';

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

function checkPreviewDefault(preview: DebugElement, activeIndex: number, currentIndex: number, size: Size = DEFAULT_PREVIEW_SIZE) {
  checkPreview(preview, activeIndex, currentIndex, size, IMAGES);
}

function checkPreviewCustomAccessibility(preview: DebugElement, activeIndex: number, currentIndex: number,
                                         size: Size = DEFAULT_PREVIEW_SIZE) {
  checkPreview(preview, activeIndex, currentIndex, size, IMAGES_CUSTOM_ACCESSIBILITY);
}

function checkPreview(preview: DebugElement, activeIndex: number, currentIndex: number,
                      size: Size, images: InternalLibImage[]) {
  const currentPlainImg: PlainImage = images[currentIndex].plain;
  const currentModalImg: ModalImage = images[currentIndex].modal;
  expect(preview.name).toBe('img');
  expect(preview.attributes['role']).toBe('img');
  expect(preview.attributes['aria-label']).toBe(currentModalImg.ariaLabel ? currentModalImg.ariaLabel : '');
  expect(preview.attributes['ksSize']).toBe('');
  expect(preview.styles.width).toBe(size.width);
  expect(preview.styles.height).toBe(size.height);
  expect(preview.properties['className']).toBe('inside preview-image ' + ((activeIndex === currentIndex) ? 'active' : ''));
  expect(preview.properties['src']).toBe(currentPlainImg && currentPlainImg.img ? currentPlainImg.img : currentModalImg.img);
  expect(preview.properties['title']).toBe(currentModalImg.title ? currentModalImg.title : '');
  expect(preview.properties['alt']).toBe(currentModalImg.alt ? currentModalImg.alt : '');
  expect(preview.properties['tabIndex']).toBe(0);
  expect(preview.properties['className']).toBe('inside preview-image ' + ((activeIndex === currentIndex) ? 'active' : ''));
}

function checkPreviewStateAfterClick(previews: DebugElement[], prevValue: InternalLibImage, currValue: InternalLibImage,
                                     start: number, end: number, activeIndex: number = 0) {
  fixture.detectChanges();
  comp.ngOnChanges(<SimpleChanges>{
    currentImage: {
      previousValue: prevValue,
      currentValue: currValue,
      firstChange: false,
      isFirstChange: () => false
    }
  });
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
      const initialActivePreview = 0;
      const numberOfVisiblePreviews = 3;
      comp.previewConfig = PREVIEWS_CONFIG_VISIBLE;
      comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
      comp.currentImage = IMAGES[initialActivePreview];
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
      expect(previews.length).toBe(numberOfVisiblePreviews);

      previews.forEach((preview: DebugElement, index: number) => {
        checkPreviewDefault(preview, initialActivePreview, index);
      });
    });

    it(`should display previews with custom accessibility`, () => {
      const initialActivePreview = 0;
      const numberOfVisiblePreviews = 3;
      comp.previewConfig = PREVIEWS_CONFIG_VISIBLE;
      // custom accessibility for container and arrows, but not for previews
      comp.accessibilityConfig = CUSTOM_ACCESSIBILITY;
      comp.currentImage = IMAGES_CUSTOM_ACCESSIBILITY[initialActivePreview];
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
      expect(previews.length).toBe(numberOfVisiblePreviews);

      previews.forEach((preview: DebugElement, index: number) => {
        checkPreviewCustomAccessibility(preview, initialActivePreview, index);
      });
    });

    it(`should display a custom number of previews without navigation arrows`, () => {
      const initialActivePreview = 0;
      const numberOfVisiblePreviews = 2;
      comp.previewConfig = {visible: true, number: 2, arrows: false};
      comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
      comp.currentImage = IMAGES[initialActivePreview];
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
      expect(previews.length).toBe(numberOfVisiblePreviews);

      previews.forEach((preview: DebugElement, index: number) => {
        checkPreviewDefault(preview, initialActivePreview, index);
      });
    });

    CUSTOM_SIZES.forEach((size: Size, index: number) => {
      it(`should display previews with custom sizes. Index i=${index}`, () => {
        const initialActivePreview = 0;
        const numberOfVisiblePreviews = 3;
        comp.previewConfig = {visible: true, size: size};
        comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
        comp.currentImage = IMAGES[initialActivePreview];
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
        expect(previews.length).toBe(numberOfVisiblePreviews);
        previews.forEach((preview: DebugElement, i: number) => checkPreviewDefault(preview, 0, i, size));
      });
    });

    it(`should display previews (first one is active) and click on the second one`, () => {
      const initialActivePreview = 0;
      const afterClickActivePreview = 0;
      const numberOfVisiblePreviews = 3;
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

      const arrows: DebugElement[] = element.queryAll(By.css('a'));
      checkArrows(arrows, true, false);

      const previews: DebugElement[] = element.queryAll(By.css('img'));
      expect(previews.length).toBe(numberOfVisiblePreviews);

      previews.forEach((preview: DebugElement, index: number) => {
        checkPreviewDefault(preview, initialActivePreview, index);
      });

      previews[afterClickActivePreview].nativeElement.click();
    });

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

        const previews: DebugElement[] = element.queryAll(By.css('img'));
        expect(previews.length).toBe(3);

        const arrows: DebugElement[] = element.queryAll(By.css('a'));
        expect(arrows.length).toBe(2);

        spyOn(comp, 'onImageEvent').and.callThrough();

        // this should change the current preview triggering ngOnChanges to navigate next/prev
        // however this is a unit testing and I cannot use modal-gallery.component,
        // so I have to simulate this behaviour manually
        previews[0].nativeElement.click();
        checkPreviewStateAfterClick(previews, IMAGES[0], IMAGES[0], 0, 3, 0);
        previews.forEach((preview: DebugElement, i: number) => checkPreviewDefault(preview, 0, i));

        previews[1].nativeElement.click();
        checkPreviewStateAfterClick(previews, IMAGES[0], IMAGES[1], 1, 4, 1);

        previews[1].nativeElement.click();
        checkPreviewStateAfterClick(previews, IMAGES[1], IMAGES[2], 2, 5, 2);

        previews[1].nativeElement.click();
        checkPreviewStateAfterClick(previews, IMAGES[2], IMAGES[3], 2, 5, 3);

        previews[2].nativeElement.click();
        checkPreviewStateAfterClick(previews, IMAGES[3], IMAGES[4], 2, 5, 4);

        // ... and then go back

        previews[1].nativeElement.click();
        checkPreviewStateAfterClick(previews, IMAGES[4], IMAGES[3], 1, 4, 3);

        previews[1].nativeElement.click();
        checkPreviewStateAfterClick(previews, IMAGES[3], IMAGES[2], 0, 3, 2);

        previews[1].nativeElement.click();
        checkPreviewStateAfterClick(previews, IMAGES[2], IMAGES[1], 0, 3, 1);

        previews[0].nativeElement.click();
        checkPreviewStateAfterClick(previews, IMAGES[1], IMAGES[0], 0, 3, 0);
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
