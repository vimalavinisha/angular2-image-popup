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

import { async, ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import 'hammerjs';
import 'mousetrap';

import { CarouselComponent } from './carousel.component';
import { CarouselPreviewsComponent } from './carousel-previews/carousel-previews.component';
import { SizeDirective } from '../../directives/size.directive';
import { ModalGalleryComponent } from '../modal-gallery/modal-gallery.component';
import { DescriptionDirective } from '../../directives/description.directive';
import { DotsComponent } from '../dots/dots.component';
import { MaxSizeDirective } from '../../directives/max-size.directive';
import { PlainGalleryComponent } from '../plain-gallery/plain-gallery.component';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { BackgroundComponent } from '../background/background.component';
import { UpperButtonsComponent } from '../upper-buttons/upper-buttons.component';
import { CurrentImageComponent } from '../current-image/current-image.component';
import { LoadingSpinnerComponent } from '../current-image/loading-spinner/loading-spinner.component';
import { PreviewsComponent } from '../previews/previews.component';
import { KeyboardNavigationDirective } from '../../directives/keyboard-navigation.directive';
import { ATagBgImageDirective } from '../../directives/a-tag-bg-image.directive';
import { WrapDirective } from '../../directives/wrap.directive';
import { DirectionDirective } from '../../directives/direction.directive';
import { KEYBOARD_CONFIGURATION, KeyboardService } from '../../services/keyboard.service';
import { KeyboardServiceConfig } from '../../model/keyboard-service-config.interface';
import { GalleryService } from '../../services/gallery.service';
import { IdValidatorService } from '../../services/id-validator.service';
import { Image } from '../../model/image.class';
import { CarouselConfig } from '../../model/carousel-config.interface';
import { PlayConfig } from '../../model/play-config.interface';
import { KS_DEFAULT_ACCESSIBILITY_CONFIG } from '../accessibility-default';
import { AccessibilityConfig } from '../../model/accessibility.interface';
import { Description, DescriptionStrategy, DescriptionStyle } from '../../model/description.interface';
import { CarouselImageConfig } from '../../model/carousel-image-config.interface';
import { getIndex } from '../../utils/image.util';
import { CarouselPreviewConfig } from '../../model/carousel-preview-config.interface';
import { DotsConfig } from '../../model/dots-config.interface';
import { ConfigService } from '../../services/config.service';

let comp: CarouselComponent;
let fixture: ComponentFixture<CarouselComponent>;

interface TestModel {
  currentImgTitle: string;
  currentAlt: string;
  currentDescription: string;
  currentImgAriaLabel: string;
}

const TEST_MODEL: TestModel[] = [
  {
    currentImgTitle: 'Image 1/7 - Description 1',
    currentAlt: 'Description 1',
    currentDescription: 'Image 1/7 - Description 1',
    currentImgAriaLabel: 'First image aria-label'
  },
  {
    currentImgTitle: 'Image 2/7',
    currentAlt: 'Image 2',
    currentDescription: 'Image 2',
    currentImgAriaLabel: 'ariaLabel'
  },
  {
    currentImgTitle: 'Third image title',
    currentAlt: 'Third image alt',
    currentDescription: 'Image 3/7 - Description 3',
    currentImgAriaLabel: 'Third image aria-label'
  },
  {
    currentImgTitle: 'Fourth image title (modal obj)',
    currentAlt: 'Fourth image alt (modal obj)',
    currentDescription: 'Image 4/7 - Description 4',
    currentImgAriaLabel: 'Fourth image aria-label (modal obj)'
  },
  {
    currentImgTitle: 'Image 5/7',
    currentAlt: 'Image 5',
    currentDescription: 'Image 5/7',
    currentImgAriaLabel: 'ariaLabel'
  },
  {
    currentImgTitle: 'Image 6/7 - Description 6',
    currentAlt: 'Description 6',
    currentDescription: 'Image 6/7 - Description 6',
    currentImgAriaLabel: 'ariaLabel'
  },
  {
    currentImgTitle: 'Image 7/7',
    currentAlt: 'Image 7',
    currentDescription: 'Image 7/7',
    currentImgAriaLabel: 'ariaLabel'
  }
];

const IMAGES: Image[] = [
  new Image(
    0,
    {
      img: '/assets/images/gallery/milan-pegasus-gallery-statue.jpg',
      description: 'Description 1'
    },
    {
      img: '/assets/images/gallery/thumbs/t-milan-pegasus-gallery-statue.jpg',
      title: 'First image title',
      alt: 'First image alt',
      ariaLabel: 'First image aria-label'
    }
  ),
  new Image(1, {img: '/assets/images/gallery/pexels-photo-47223.jpeg'}, {img: '/assets/images/gallery/thumbs/t-pexels-photo-47223.jpg'}),
  new Image(
    2,
    {
      img: '/assets/images/gallery/pexels-photo-52062.jpeg',
      description: 'Description 3',
      title: 'Third image title',
      alt: 'Third image alt',
      ariaLabel: 'Third image aria-label'
    },
    {
      img: '/assets/images/gallery/thumbs/t-pexels-photo-52062.jpg',
      description: 'Description 3'
    }
  ),
  new Image(
    3,
    {
      img: '/assets/images/gallery/pexels-photo-66943.jpeg',
      description: 'Description 4',
      title: 'Fourth image title (modal obj)',
      alt: 'Fourth image alt (modal obj)',
      ariaLabel: 'Fourth image aria-label (modal obj)'
    },
    {
      img: '/assets/images/gallery/thumbs/t-pexels-photo-66943.jpg',
      title: 'Fourth image title (plain obj)',
      alt: 'Fourth image alt (plain obj)',
      ariaLabel: 'Fourth image aria-label (plain obj)'
    }
  ),
  new Image(4, {img: '/assets/images/gallery/pexels-photo-93750.jpeg'}, {img: '/assets/images/gallery/thumbs/t-pexels-photo-93750.jpg'}),
  new Image(
    5,
    {
      img: '/assets/images/gallery/pexels-photo-94420.jpeg',
      description: 'Description 6'
    },
    {img: '/assets/images/gallery/thumbs/t-pexels-photo-94420.jpg'}
  ),
  new Image(6, {img: '/assets/images/gallery/pexels-photo-96947.jpeg'}, {img: '/assets/images/gallery/thumbs/t-pexels-photo-96947.jpg'})
];

const ID_ERROR = 'Cannot open gallery via GalleryService with either index<0 or galleryId<0 or galleryId===undefined';

const CUSTOM_ACCESSIBILITY: AccessibilityConfig = Object.assign({}, KS_DEFAULT_ACCESSIBILITY_CONFIG);
CUSTOM_ACCESSIBILITY.carouselContainerAriaLabel = 'carouselContainerAriaLabel';
CUSTOM_ACCESSIBILITY.carouselContainerTitle = 'carouselContainerTitle';
CUSTOM_ACCESSIBILITY.carouselPrevImageAriaLabel = 'carouselPrevImageAriaLabel';
CUSTOM_ACCESSIBILITY.carouselPrevImageTitle = 'carouselPrevImageTitle';
CUSTOM_ACCESSIBILITY.carouselNextImageAriaLabel = 'carouselNextImageAriaLabel';
CUSTOM_ACCESSIBILITY.carouselNextImageTitle = 'carouselNextImageTitle';
CUSTOM_ACCESSIBILITY.dotsContainerAriaLabel = 'dotsContainerAriaLabel';
CUSTOM_ACCESSIBILITY.dotsContainerTitle = 'dotsContainerTitle';
CUSTOM_ACCESSIBILITY.carouselPreviewsContainerAriaLabel = 'carouselPreviewsContainerAriaLabel';
CUSTOM_ACCESSIBILITY.carouselPreviewsContainerTitle = 'carouselPreviewsContainerTitle';
CUSTOM_ACCESSIBILITY.carouselPreviewScrollPrevAriaLabel = 'carouselPreviewScrollPrevAriaLabel';
CUSTOM_ACCESSIBILITY.carouselPreviewScrollPrevTitle = 'carouselPreviewScrollPrevTitle';
CUSTOM_ACCESSIBILITY.carouselPreviewScrollNextAriaLabel = 'carouselPreviewScrollNextAriaLabel';
CUSTOM_ACCESSIBILITY.carouselPreviewScrollNextTitle = 'carouselPreviewScrollNextTitle';


const DEFAULT_CAROUSEL_CONFIG: CarouselConfig = {
  maxWidth: '100%',
  maxHeight: '400px',
  showArrows: true,
  objectFit: 'cover',
  keyboardEnable: true,
  modalGalleryEnable: false,
  legacyIE11Mode: false
};

function initTestBed() {
  return TestBed.configureTestingModule({
    declarations: [
      ClickOutsideDirective, BackgroundComponent,
      UpperButtonsComponent, CurrentImageComponent, LoadingSpinnerComponent,
      PreviewsComponent,
      KeyboardNavigationDirective, ATagBgImageDirective,
      WrapDirective, DirectionDirective,
      CarouselComponent, CarouselPreviewsComponent, ModalGalleryComponent, PlainGalleryComponent,
      SizeDirective, DescriptionDirective, DotsComponent, MaxSizeDirective]
  }).overrideComponent(ModalGalleryComponent, {
    set: {
      providers: [
        {
          provide: KeyboardService,
          useFactory: (injector: KeyboardServiceConfig) => new KeyboardService(injector),
          deps: [KEYBOARD_CONFIGURATION]
        },
        {
          provide: GalleryService,
          useClass: GalleryService
        },
        {
          provide: ConfigService,
          useClass: ConfigService
        },
        {
          provide: KEYBOARD_CONFIGURATION,
          useValue: {}
        },
        {
          provide: IdValidatorService,
          useClass: IdValidatorService
        }
      ]
    }
  });
}

function checkMainContainer(maxWidth: string = '100%', accessibilityConfig: AccessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG) {
  const element: DebugElement = fixture.debugElement;
  const mainCarouselContainer: DebugElement = element.query(By.css('main#carousel-container'));
  expect(mainCarouselContainer.name).toBe('main');
  expect(mainCarouselContainer.attributes['ksMaxSize']).toBe('');
  expect(mainCarouselContainer.properties['title']).toBe(accessibilityConfig.carouselContainerTitle);
  expect(mainCarouselContainer.attributes['aria-label']).toBe(accessibilityConfig.carouselContainerAriaLabel);
  // expect(mainCarouselContainer.attributes['style']).toBe('max-width: 100%;');

  if (maxWidth !== '100%') {
    expect(mainCarouselContainer.styles['max-width']).toBe(maxWidth);
  }
}

function checkCurrentImage(currentImage: Image, val: TestModel, withDots: boolean = true, withArrows: boolean = true, accessibilityConfig: AccessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG) {
  const element: DebugElement = fixture.debugElement;
  const currentFigure: DebugElement = element.query(By.css('figure.current-figure'));
  expect(currentFigure.name).toBe('figure');
  expect(currentFigure.attributes['ksSize']).toBe('');
  const currentImageElement: DebugElement = currentFigure.children[withArrows ? 1 : 0]; // 0 and 2 are the arrows
  expect(currentImageElement.name).toBe('img');
  expect(currentImageElement.attributes['id']).toBe('current-image');
  expect(currentImageElement.attributes['role']).toBe('img');
  expect(currentImageElement.properties['src']).toBe(currentImage.modal.img);
  expect(currentImageElement.properties['title']).toBe(val.currentImgTitle);
  expect(currentImageElement.properties['alt']).toBe(val.currentAlt);
  expect(currentImageElement.properties['tabIndex']).toBe(0);

  if (withDots) {
    const dotsMainContainer: DebugElement = element.query(By.css('div#dots'));
    expect(dotsMainContainer.name).toBe('div');
    const dotsContainer: DebugElement = element.query(By.css('nav.dots-container'));
    expect(dotsContainer.name).toBe('nav');
    expect(dotsContainer.attributes['aria-label']).toBe(accessibilityConfig.dotsContainerAriaLabel);
    expect(dotsContainer.properties['title']).toBe(accessibilityConfig.dotsContainerTitle);
    const dots: DebugElement[] = dotsContainer.children;
    expect(dots.length).toBe(IMAGES.length);

    const activeDotIndex = 0;
    dots.forEach((dot: DebugElement, index: number) => {
      expect(dot.name).toBe('div');
      expect(dot.attributes['role']).toBe('navigation');
      expect(dot.properties['tabIndex']).toBe(0);
      if (index === activeDotIndex) {
        // I don't know why, but with dot.attributes['class'] I can't see 'active'. In this way it's working!
        // TODO fix this because is not working as expected. This line is ok, but tests aren't restarting from image 0
        // expect(dot.classes).toEqual({'inside': true, 'dot': true, 'active': true});
      } else {
        expect(dot.attributes['class']).toBe('inside dot');
        // or like above: expect(dot.classes).toEqual({'inside': true, 'dot': true});
      }
      expect(dot.attributes['aria-label']).toBe(accessibilityConfig.dotAriaLabel + ' ' + (index + 1));
    });
  }
}

function checkCurrentImageIe11Legacy(currentImage: Image, val: TestModel, withDots: boolean = true, withArrows: boolean = true,
                                     accessibilityConfig: AccessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG) {
  const element: DebugElement = fixture.debugElement;
  const currentFigure: DebugElement = element.query(By.css('div.current-figure'));
  expect(currentFigure.name).toBe('div');
  expect(currentFigure.attributes['ksSize']).toBe('');
  const currentImageElement: DebugElement = currentFigure.children[withArrows ? 1 : 0]; // 0 and 2 are the arrows
  expect(currentImageElement.name).toBe('div');
  expect(currentImageElement.attributes['id']).toBe('current-image-legacy');
  expect(currentImageElement.attributes['role']).toBe('img');
  expect(currentImageElement.styles['background-color']).toBe('transparent');
  expect(currentImageElement.styles['background-image']).toBe(`url(${currentImage.modal.img})`);
  expect(currentImageElement.styles['background-position']).toBe('center center');
  expect(currentImageElement.styles['background-size']).toBe('cover');
  expect(currentImageElement.styles['background-repeat']).toBe('no-repeat');
  expect(currentImageElement.styles['background-attachment']).toBe('scroll');
  expect(currentImageElement.properties['title']).toBe(val.currentImgTitle);
  expect(currentImageElement.properties['tabIndex']).toBe(0);

  if (withDots) {
    const dotsMainContainer: DebugElement = element.query(By.css('div#dots-ie11'));
    expect(dotsMainContainer.name).toBe('div');
    const dotsContainer: DebugElement = element.query(By.css('nav.dots-container'));
    expect(dotsContainer.name).toBe('nav');
    expect(dotsContainer.attributes['aria-label']).toBe(accessibilityConfig.dotsContainerAriaLabel);
    expect(dotsContainer.properties['title']).toBe(accessibilityConfig.dotsContainerTitle);
    const dots: DebugElement[] = dotsContainer.children;
    expect(dots.length).toBe(IMAGES.length);

    const activeDotIndex = 0;
    dots.forEach((dot: DebugElement, index: number) => {
      expect(dot.name).toBe('div');
      expect(dot.attributes['role']).toBe('navigation');
      expect(dot.properties['tabIndex']).toBe(0);
      if (index === activeDotIndex) {
        // I don't know why, but with dot.attributes['class'] I can't see 'active'. In this way it's working!
        // TODO fix this because is not working as expected. This line is ok, but tests aren't restarting from image 0
        // expect(dot.classes).toEqual({'inside': true, 'dot': true, 'active': true});
      } else {
        expect(dot.attributes['class']).toBe('inside dot');
        // or like above: expect(dot.classes).toEqual({'inside': true, 'dot': true});
      }
      expect(dot.attributes['aria-label']).toBe(accessibilityConfig.dotAriaLabel + ' ' + (index + 1));
    });
  }
}

function checkDescription(currentImage: Image, carouselImageConfig: CarouselImageConfig) {
  const element: DebugElement = fixture.debugElement;
  const currentFigcaption: DebugElement = element.query(By.css('figcaption.description'));
  if (carouselImageConfig.description.strategy !== DescriptionStrategy.ALWAYS_HIDDEN) {
    // expect(currentFigure.attributes['ksDescription']).toBe('');
    expect(currentFigcaption.attributes['class']).toBe('description');
    // TODO check style background: rgba(0, 0, 0, 0.5); color: white; margin: 0px;
    expect(currentFigcaption.nativeElement.textContent).toEqual(getDescriptionToDisplay(carouselImageConfig.description.strategy, currentImage, carouselImageConfig));
  }
}

function getDescriptionToDisplay(descStrategy: DescriptionStrategy, image: Image, carouselImageConfig: CarouselImageConfig): string {
  const imageWithoutDescription: boolean = !image.modal || !image.modal.description || image.modal.description === '';

  switch (descStrategy) {
    case DescriptionStrategy.HIDE_IF_EMPTY:
      return imageWithoutDescription ? '' : image.modal.description + '';
    case DescriptionStrategy.ALWAYS_HIDDEN:
      return '';
    default:
      // ----------- DescriptionStrategy.ALWAYS_VISIBLE -----------------
      return buildTextDescription(image, imageWithoutDescription, carouselImageConfig);
  }
}

function buildTextDescription(image: Image, imageWithoutDescription: boolean, carouselImageConfig: CarouselImageConfig): string {
  // // If customFullDescription use it, otherwise proceed to build a description
  // if (this.configCurrentImageCarousel.description.customFullDescription && this.configCurrentImageCarousel.description.customFullDescription !== '') {
  //   return this.configCurrentImageCarousel.description.customFullDescription;
  // }

  const currentIndex: number = getIndex(image, IMAGES);
  // If the current image hasn't a description,
  // prevent to write the ' - ' (or this.description.beforeTextDescription)

  const prevDescription: string = carouselImageConfig.description.imageText ? carouselImageConfig.description.imageText : '';
  const midSeparator: string = carouselImageConfig.description.numberSeparator
    ? carouselImageConfig.description.numberSeparator
    : '';
  const middleDescription: string = currentIndex + 1 + midSeparator + IMAGES.length;

  if (imageWithoutDescription) {
    return prevDescription + middleDescription;
  }

  const currImgDescription: string = image.modal && image.modal.description ? image.modal.description : '';
  // return currImgDescription; // TODO remove this
  const endDescription: string = carouselImageConfig.description.beforeTextDescription + currImgDescription;
  return prevDescription + middleDescription + endDescription;
}

function checkArrows(isFirstImage: boolean, isLastImage: boolean, accessibilityConfig: AccessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG) {
  const element: DebugElement = fixture.debugElement;
  const aNavLeft: DebugElement = element.query(By.css('a.nav-left'));
  expect(aNavLeft.name).toBe('a');
  expect(aNavLeft.attributes['role']).toBe('button');
  expect(aNavLeft.attributes['aria-label']).toBe(accessibilityConfig.carouselPrevImageAriaLabel);
  expect(aNavLeft.properties['tabIndex']).toBe(isFirstImage ? -1 : 0);
  const divNavLeft: DebugElement = aNavLeft.children[0];
  expect(divNavLeft.attributes['aria-hidden']).toBe('true');
  expect(divNavLeft.properties['className']).toBe('inside ' + (isFirstImage ? 'empty-arrow-image' : 'left-arrow-image'));
  expect(divNavLeft.properties['title']).toBe(accessibilityConfig.carouselPrevImageTitle);

  const aNavRight: DebugElement = element.query(By.css('a.nav-right'));
  expect(aNavRight.name).toBe('a');
  expect(aNavRight.attributes['role']).toBe('button');
  expect(aNavRight.attributes['aria-label']).toBe(accessibilityConfig.carouselNextImageAriaLabel);
  expect(aNavRight.properties['tabIndex']).toBe(isLastImage ? -1 : 0);
  const divNavRight: DebugElement = aNavRight.children[0];
  expect(divNavRight.attributes['aria-hidden']).toBe('true');
  expect(divNavRight.properties['className']).toBe('inside ' + (isLastImage ? 'empty-arrow-image' : 'right-arrow-image'));
  expect(divNavRight.properties['title']).toBe(accessibilityConfig.carouselNextImageTitle);
}

function checkPreviews(numPreviews: number, isFirstImage: boolean, isLastImage: boolean, clickable: boolean, accessibilityConfig: AccessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG) {
  const element: DebugElement = fixture.debugElement;
  const previewsContainer: DebugElement = element.query(By.css('nav.previews-container'));
  expect(previewsContainer.name).toBe('nav');
  expect(previewsContainer.attributes['aria-label']).toBe(accessibilityConfig.carouselPreviewsContainerAriaLabel);
  expect(previewsContainer.properties['title']).toBe(accessibilityConfig.carouselPreviewsContainerTitle);

  const aNavLeft: DebugElement = element.query(By.css('a.nav-left'));
  const divNavLeft: DebugElement = aNavLeft.children[0];
  expect(divNavLeft.name).toBe('div');
  expect(divNavLeft.attributes['aria-hidden']).toBe('true');
  expect(divNavLeft.properties['className']).toBe('inside ' + (isFirstImage ? 'empty-arrow-image' : 'left-arrow-image'));
  // TODO fixme
  // expect(divNavLeft.attributes['aria-label']).toBe(accessibilityConfig.carouselPreviewScrollPrevAriaLabel);
  // expect(divNavLeft.properties['title']).toBe(accessibilityConfig.carouselPreviewScrollPrevTitle);

  const aNavRight: DebugElement = element.query(By.css('a.nav-right'));
  const divNavRight: DebugElement = aNavRight.children[0];
  expect(divNavRight.name).toBe('div');
  expect(divNavRight.attributes['aria-hidden']).toBe('true');
  expect(divNavRight.properties['className']).toBe('inside ' + (isFirstImage ? 'empty-arrow-image' : 'right-arrow-image'));
  // TODO fixme
  // expect(divNavRight.attributes['aria-label']).toBe(accessibilityConfig.carouselPreviewScrollNextAriaLabel);
  // expect(divNavRight.properties['title']).toBe(accessibilityConfig.carouselPreviewScrollNextTitle);

  const previewsInner: DebugElement = element.query(By.css('div.preview-inner-container'));
  expect(previewsInner.name).toBe('div');
  const previews: DebugElement[] = previewsInner.children;
  expect(previews.length).toBe(numPreviews);
  previews.forEach((preview: DebugElement, index: number) => {
    expect(preview.attributes['ksSize']).toBe('');
    expect(preview.attributes['role']).toBe('img');
    expect(preview.properties['className']).toBe('inside preview-image' + (index === 0 ? ' active' : '') + (clickable ? '' : ' unclickable'));
    expect(preview.properties['tabIndex']).toBe(0);
    // expect(preview.properties['style']).toBe('width: 25%; height: 200px;');
    // expect(preview.properties['src']).toBe(previewsContainer.modal.img);
    // expect(preview.attributes['aria-label']).toBe();
    // expect(preview.properties['title']).toBe();
    // expect(preview.properties['alt']).toBe();
  });
}

describe('CarouselComponent', () => {
  beforeEach(async(() => {
    return initTestBed();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselComponent);
    comp = fixture.componentInstance;
  });

  it('should instantiate it', () => expect(comp).not.toBeNull());


  // should navigate between images clicking on current image. Test i=0
  // should navigate between images clicking on right side preview. Test i=0
  // should navigate between images to the right using swipe gestures. Test i=0

  describe('---YES---', () => {

    it(`should display carousel with all defaults and auto-navigate (play enabled by default).`, fakeAsync(() => {
      comp.id = 0;
      comp.images = IMAGES;
      fixture.detectChanges();
      const defaultInterval = 5000;

      TEST_MODEL.forEach((val: TestModel, index: number) => {
        checkMainContainer();
        checkCurrentImage(IMAGES[index], val);
        checkArrows(false, false);
        tick(defaultInterval + 100);
        flush();
        fixture.detectChanges();
      });

      tick(defaultInterval + 100);
      flush();
      fixture.detectChanges();

      discardPeriodicTasks();
    }));

    it(`should display carousel with all defaults and auto-navigate (play enabled by default) trying infinite sliding.`, fakeAsync(() => {
      comp.id = 0;
      comp.images = IMAGES;
      fixture.detectChanges();
      const defaultInterval = 5000;

      TEST_MODEL.forEach((val: TestModel, index: number) => {
        checkMainContainer();
        checkCurrentImage(IMAGES[index], val);
        checkArrows(false, false);
        tick(defaultInterval + 100);
        flush();
        fixture.detectChanges();
      });

      // check the first image (because of infinite sliding)
      checkMainContainer();
      checkCurrentImage(IMAGES[0], TEST_MODEL[0]);
      checkArrows(false, false);
      tick(defaultInterval + 100);
      flush();
      fixture.detectChanges();

      discardPeriodicTasks();
    }));

    it(`should display carousel no infinite and auto-navigate.`, fakeAsync(() => {
      comp.id = 0;
      comp.images = IMAGES;
      comp.infinite = false;
      fixture.detectChanges();

      const defaultInterval = 5000;

      TEST_MODEL.forEach((val: TestModel, index: number) => {
        checkMainContainer();
        checkCurrentImage(IMAGES[index], val);
        // checkArrows(index === 0, index === 6);
        tick(defaultInterval + 100);
        flush();
        fixture.detectChanges();
      });

      // infinite sliding is disabled, so after the next interval, current image must be still the last one
      checkMainContainer();
      checkCurrentImage(IMAGES[6], TEST_MODEL[6]);
      // checkArrows(false, true);
      tick(defaultInterval + 100);
      flush();
      fixture.detectChanges();

      discardPeriodicTasks();
    }));

    it(`should display carousel without dots.`, () => {
      comp.id = 0;
      comp.images = IMAGES;
      comp.dotsConfig = <DotsConfig>{visible: false};
      fixture.detectChanges();

      checkMainContainer();
      checkCurrentImage(IMAGES[0], TEST_MODEL[0], false, true);
      checkArrows(false, false);
    });

    it(`should display carousel without arrows.`, fakeAsync(() => {
      comp.id = 0;
      comp.images = IMAGES;
      comp.carouselConfig = Object.assign({}, DEFAULT_CAROUSEL_CONFIG, {showArrows: false});
      fixture.detectChanges();

      checkMainContainer();
      checkCurrentImage(IMAGES[0], TEST_MODEL[0], false, false);

      discardPeriodicTasks();
    }));

    it(`should display carousel with legacyIe11Mode enabled and auto-navigate.`, fakeAsync(() => {
      comp.id = 0;
      comp.images = IMAGES;
      comp.infinite = false;
      comp.carouselConfig = Object.assign({}, DEFAULT_CAROUSEL_CONFIG, {legacyIE11Mode: true});
      fixture.detectChanges();

      const defaultInterval = 5000;

      TEST_MODEL.forEach((val: TestModel, index: number) => {
        checkMainContainer();
        checkCurrentImageIe11Legacy(IMAGES[index], val);
        // checkArrows(index === 0, index === 6);
        tick(defaultInterval + 100);
        flush();
        fixture.detectChanges();
      });

      // infinite sliding is disabled, so after the next interval, current image must be still the last one
      checkMainContainer();
      checkCurrentImageIe11Legacy(IMAGES[6], TEST_MODEL[6]);
      // checkArrows(false, true);
      tick(defaultInterval + 100);
      flush();
      fixture.detectChanges();

      discardPeriodicTasks();
    }));

    const PLAY_CONFIG_AUTOPLAY: PlayConfig[] = [
      {autoPlay: true, interval: 5000, pauseOnHover: true},
      {autoPlay: true, interval: 1000, pauseOnHover: true},
      {autoPlay: true, interval: 10000, pauseOnHover: true},
      {autoPlay: true, interval: 10, pauseOnHover: true},
      {autoPlay: true, interval: 1000, pauseOnHover: false}
    ];

    PLAY_CONFIG_AUTOPLAY.forEach((val: PlayConfig, index: number) => {
      it(`should display carousel with autoplay enabled, but with different combinations of interval and pauseOnHover. Test i=${index}`, fakeAsync(() => {
        comp.id = 0;
        comp.images = IMAGES;
        comp.playConfig = val;
        fixture.detectChanges();

        TEST_MODEL.forEach((model: TestModel, modelIndex: number) => {
          checkMainContainer();
          checkCurrentImage(IMAGES[modelIndex], model);
          checkArrows(false, false);
          tick(val.interval + 1);
          flush();
          fixture.detectChanges();
        });

        tick(val.interval + 1);
        flush();
        fixture.detectChanges();

        discardPeriodicTasks();
      }));
    });

    const PLAY_CONFIG_NO_AUTOPLAY: PlayConfig[] = [
      {autoPlay: false, interval: 1000, pauseOnHover: true},
      {autoPlay: false, interval: 10000, pauseOnHover: false}
    ];

    PLAY_CONFIG_NO_AUTOPLAY.forEach((val: PlayConfig, index: number) => {
      it(`should display carousel without autoplay. Test i=${index}`, fakeAsync(() => {
        comp.id = 0;
        comp.images = IMAGES;
        comp.playConfig = val;
        fixture.detectChanges();

        checkMainContainer();
        checkCurrentImage(IMAGES[0], TEST_MODEL[0]);
        checkArrows(false, false);
        tick(val.interval + 100);
        flush();
        fixture.detectChanges();

        // after interval, the current image must be again the first image (because autoplay is disabled)
        checkMainContainer();
        // TODO uncomment this
        // checkCurrentImage(IMAGES[0], TEST_MODEL[0]);
        checkArrows(false, false);
        tick(val.interval + 100);
        flush();
        fixture.detectChanges();

        discardPeriodicTasks();
      }));
    });

    const PREVIEW_CONFIGS: CarouselPreviewConfig[] = [
      {visible: true},
      {visible: true, clickable: true},
      {visible: true, clickable: false},
      {visible: true, number: 7},
      // {visible: true, number: 0},
      // {visible: true, number: -1},
      {visible: true, number: 4, width: 'auto', maxHeight: '100px'},
      {visible: true, number: 4, width: 'auto', maxHeight: '100px'},
      {visible: true, number: 4, width: '100px', maxHeight: '100px'}
    ];

    PREVIEW_CONFIGS.forEach((val: CarouselPreviewConfig, index: number) => {
      it(`should display carousel with previews. Test i=${index}`, () => {
        comp.id = 0;
        comp.images = IMAGES;
        comp.previewConfig = val;
        fixture.detectChanges();

        checkPreviews(val.number || 4, false, false, val.clickable === true || val.clickable === undefined);
      });
    });

    it(`should display carousel with fixed width.`, () => {
      comp.id = 0;
      comp.images = IMAGES;
      comp.carouselConfig =  Object.assign({}, DEFAULT_CAROUSEL_CONFIG, {maxWidth: '766px'});
      comp.previewConfig = <CarouselPreviewConfig>{number: 5, width: 'auto', maxHeight: '100px'};
      fixture.detectChanges();

      checkMainContainer(comp.carouselConfig.maxWidth);
      checkCurrentImage(IMAGES[0], TEST_MODEL[0]);
      checkArrows(false, false);
    });

    const defaultDescriptionStyle: DescriptionStyle = {
      bgColor: 'rgba(0, 0, 0, .5)',
      textColor: 'white',
      marginTop: '0px',
      marginBottom: '0px',
      marginLeft: '0px',
      marginRight: '0px'
    };

    const carouselImageConfigs: CarouselImageConfig[] = [
      {
        description: <Description>{
          strategy: DescriptionStrategy.ALWAYS_VISIBLE,
          imageText: 'Image ',
          numberSeparator: '/',
          beforeTextDescription: ' - ',
          style: defaultDescriptionStyle
        }
      },
      {
        description: <Description>{
          strategy: DescriptionStrategy.ALWAYS_HIDDEN,
          imageText: 'Image ',
          numberSeparator: '/',
          beforeTextDescription: ' - ',
          style: defaultDescriptionStyle
        }
      },
      {
        description: <Description>{
          strategy: DescriptionStrategy.HIDE_IF_EMPTY,
          imageText: 'Image ',
          numberSeparator: '/',
          beforeTextDescription: ' - ',
          style: defaultDescriptionStyle
        }
      }
    ];

    carouselImageConfigs.forEach((val: CarouselImageConfig, index: number) => {
      it(`should display carousel with description. Test i=${index}`, () => {
        comp.id = 0;
        comp.images = IMAGES;
        comp.carouselImageConfig = val;
        fixture.detectChanges();

        checkMainContainer();
        checkCurrentImage(IMAGES[0], TEST_MODEL[0]);
        checkDescription(IMAGES[0], val);
        checkArrows(false, false);
      });
    });

    const PREVIEW_CONFIGS_BREAKPOINT: CarouselPreviewConfig[] = [
      {visible: true, breakpoints: {xSmall: 50, small: 60, medium: 80, large: 150, xLarge: 180}},
      {visible: true, breakpoints: {xSmall: 100, small: 120, medium: 150, large: 200, xLarge: 220}},
      {visible: true, breakpoints: {xSmall: 200, small: 220, medium: 10, large: 50, xLarge: 100}},
      // zero or negative numbers are admitted in the code, but they are completely useless for the user
      // however, I should improve this
      {visible: true, breakpoints: {xSmall: 0, small: 0, medium: 0, large: 0, xLarge: 0}},
      {visible: true, breakpoints: {xSmall: -1, small: -2, medium: -10, large: -10, xLarge: -1}}
    ];

    PREVIEW_CONFIGS_BREAKPOINT.forEach((previewConfig: CarouselPreviewConfig, index: number) => {
      it(`should display carousel with custom breakpoints.`, () => {
        comp.id = 0;
        comp.images = IMAGES;
        comp.previewConfig = previewConfig;
        fixture.detectChanges();

        checkMainContainer();
        checkCurrentImage(IMAGES[0], TEST_MODEL[0]);
        checkArrows(false, false);
      });
    });

    it(`should display carousel with custom accessibility.`, () => {
      comp.id = 0;
      comp.images = IMAGES;
      comp.accessibilityConfig = CUSTOM_ACCESSIBILITY;
      fixture.detectChanges();

      checkMainContainer('100%', CUSTOM_ACCESSIBILITY);
      checkCurrentImage(IMAGES[0], TEST_MODEL[0], true, true, CUSTOM_ACCESSIBILITY);
      checkArrows(false, false, CUSTOM_ACCESSIBILITY);
    });

    // // TODO not working, why???
    // it(`should display carousel and open modal-gallery clicking on the current image.`, () => {
    //   comp.id = 0;
    //   comp.images = IMAGES;
    //   comp.carouselConfig = <CarouselConfig>{
    //     maxWidth: '100%',
    //     maxHeight: '200px',
    //     showArrows: true,
    //     objectFit: 'cover',
    //     keyboardEnable: true,
    //     modalGalleryEnable: true, // modalGalleryEnable is required in this test
    //     legacyIE11Mode: false
    //   };
    //   comp.ngOnInit();
    //   fixture.detectChanges();
    //
    //   checkMainContainer();
    //   checkCurrentImage(IMAGES[0], TEST_MODEL[0]);
    //   checkArrows(false, false);
    //   // tick(defaultInterval + 100);
    //   // fixture.detectChanges();
    //
    //   // click on the current image
    //   const element: DebugElement = fixture.debugElement;
    //   const currentImage: DebugElement = element.query(By.css('img#current-image'));
    //   console.log('currentImage', currentImage);
    //
    //   currentImage.nativeElement.click();
    //
    //
    //   fixture.detectChanges();
    //
    //   const modalGalleryWrapper: DebugElement = element.query(By.css('#modal-gallery-wrapper'));
    //   console.log('modalGalleryWrapper', modalGalleryWrapper);
    //   expect(modalGalleryWrapper).not.toBeNull();
    // });

    // it(`should display carousel without autoplay and navigate between images clicking on arrows.`, fakeAsync(() => {
    //   comp.id = 0;
    //   comp.images = IMAGES;
    //   comp.ngOnInit();
    //   fixture.detectChanges();
    //
    //   comp.show.subscribe((res: ImageModalEvent) => {
    //     console.log('^^^^^^^^^^^^^^^^^^^^^^ show called res', res);
    //     // checkMainContainer();
    //     // checkCurrentImage(IMAGES[1], TEST_MODEL[1]);
    //     // checkArrows(false, false);
    //     // comp.nextImage(Action.CLICK);
    //     // tick(defaultInterval + 100);
    //     fixture.detectChanges();
    //   });
    //
    //   // TEST_MODEL.forEach((val: TestModel, index: number) => {
    //   checkMainContainer();
    //   checkCurrentImage(IMAGES[0], TEST_MODEL[0]);
    //   checkArrows(false, false);
    //   // comp.nextImage(Action.CLICK);
    //   // tick(defaultInterval + 100);
    //   fixture.detectChanges();
    //   discardPeriodicTasks();
    //   // });
    // }));
  });

  describe('---ERRORS---', () => {
    it(`should throw an error, because id is not valid.`, () => {
      comp.id = -1;
      comp.images = IMAGES;
      comp.carouselConfig = Object.assign({}, DEFAULT_CAROUSEL_CONFIG, {modalGalleryEnable: true});
      comp.ngOnInit();
      expect(() => comp.onClickCurrentImage()).toThrow(new Error(ID_ERROR));
    });

    const PLAY_CONFIG_AUTOPLAY: PlayConfig[] = [
      {autoPlay: true, interval: 0, pauseOnHover: true},
      {autoPlay: true, interval: -10, pauseOnHover: false},
      {autoPlay: true, interval: -1000, pauseOnHover: true},
      {autoPlay: false, interval: 0, pauseOnHover: false},
      {autoPlay: false, interval: -10, pauseOnHover: true},
      {autoPlay: false, interval: -1000, pauseOnHover: false}
    ];

    PLAY_CONFIG_AUTOPLAY.forEach((val: PlayConfig, index: number) => {
      it(`should throw an error because playConfig.interval is <=0. Test i=${index}`, fakeAsync(() => {
        comp.id = 0;
        comp.images = IMAGES;
        comp.playConfig = val;
        expect(() => comp.ngOnInit()).toThrow(new Error(`Carousel's interval must be a number >= 0`));
        discardPeriodicTasks();
      }));
    });
  });
});
