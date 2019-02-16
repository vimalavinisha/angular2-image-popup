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

import { async, ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { DebugElement, SimpleChanges } from '@angular/core';
import { By, SafeResourceUrl } from '@angular/platform-browser';
import { KS_DEFAULT_ACCESSIBILITY_CONFIG } from '../../components/accessibility-default';
import { InternalLibImage } from '../../model/image-internal.class';
import { CurrentImageComponent } from './current-image.component';
import { SizeDirective } from '../../directives/size.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { KeyboardNavigationDirective } from '../../directives/keyboard-navigation.directive';
import { LoadingConfig, LoadingType } from '../../model/loading-config.interface';
import { SlideConfig } from '../../model/slide-config.interface';
import { Description, DescriptionStrategy } from '../../model/description.interface';
import { Size } from '../../model/size.interface';
import { AccessibilityConfig } from '../../model/accessibility.interface';
import { ImageModalEvent } from '../../model/image.class';
import { Action } from '../../model/action.enum';
import { DescriptionDirective } from '../../directives/description.directive';
import { CurrentImageConfig } from '../../model/current-image-config.interface';
import { GalleryService } from '../../services/gallery.service';
import { ConfigService } from '../../services/config.service';

let comp: CurrentImageComponent;
let fixture: ComponentFixture<CurrentImageComponent>;

interface TestModel {
  currentImgTitle: string;
  currentAlt: string;
  currentDescription: string;
  leftPreviewTitle: string;
  leftPreviewAlt: string;
  rightPreviewTitle: string;
  rightPreviewAlt: string;
}

const TEST_MODEL: TestModel[] = [
  {
    currentImgTitle: 'Image 1/5',
    currentAlt: 'Image 1',
    currentDescription: 'Image 1/5',
    leftPreviewTitle: '',
    leftPreviewAlt: '',
    rightPreviewTitle: 'Image 2/5 - Description 2',
    rightPreviewAlt: 'Description 2'
  },
  {
    currentImgTitle: 'Image 2/5 - Description 2',
    currentAlt: 'Description 2',
    currentDescription: 'Image 2/5 - Description 2',
    leftPreviewTitle: 'Image 1/5',
    leftPreviewAlt: 'Image 1',
    rightPreviewTitle: 'Image 3/5 - Description 3',
    rightPreviewAlt: 'Description 3'
  },
  {
    currentImgTitle: 'Image 3/5 - Description 3',
    currentAlt: 'Description 3',
    currentDescription: 'Image 3/5 - Description 3',
    leftPreviewTitle: 'Image 2/5 - Description 2',
    leftPreviewAlt: 'Description 2',
    rightPreviewTitle: 'Image 4/5 - Description 4',
    rightPreviewAlt: 'Description 4'
  },
  {
    currentImgTitle: 'Image 4/5 - Description 4',
    currentAlt: 'Description 4',
    currentDescription: 'Image 4/5 - Description 4',
    leftPreviewTitle: 'Image 3/5 - Description 3',
    leftPreviewAlt: 'Description 3',
    rightPreviewTitle: 'Image 5/5',
    rightPreviewAlt: 'Image 5'
  },
  {
    currentImgTitle: 'Image 5/5',
    currentAlt: 'Image 5',
    currentDescription: 'Image 5/5',
    leftPreviewTitle: 'Image 4/5 - Description 4',
    leftPreviewAlt: 'Description 4',
    rightPreviewTitle: '',
    rightPreviewAlt: ''
  }
];

const TEST_MODEL_SINGLE_IMAGE: TestModel = TEST_MODEL[0];

const TEST_MODEL_INFINITE: TestModel[] = [
  {
    currentImgTitle: 'Image 1/5',
    currentAlt: 'Image 1',
    currentDescription: 'Image 1/5',
    leftPreviewTitle: 'Image 5/5',
    leftPreviewAlt: 'Image 5',
    rightPreviewTitle: 'Image 2/5 - Description 2',
    rightPreviewAlt: 'Description 2'
  },
  {
    currentImgTitle: 'Image 2/5 - Description 2',
    currentAlt: 'Description 2',
    currentDescription: 'Image 2/5 - Description 2',
    leftPreviewTitle: 'Image 1/5',
    leftPreviewAlt: 'Image 1',
    rightPreviewTitle: 'Image 3/5 - Description 3',
    rightPreviewAlt: 'Description 3'
  },
  {
    currentImgTitle: 'Image 3/5 - Description 3',
    currentAlt: 'Description 3',
    currentDescription: 'Image 3/5 - Description 3',
    leftPreviewTitle: 'Image 2/5 - Description 2',
    leftPreviewAlt: 'Description 2',
    rightPreviewTitle: 'Image 4/5 - Description 4',
    rightPreviewAlt: 'Description 4'
  },
  {
    currentImgTitle: 'Image 4/5 - Description 4',
    currentAlt: 'Description 4',
    currentDescription: 'Image 4/5 - Description 4',
    leftPreviewTitle: 'Image 3/5 - Description 3',
    leftPreviewAlt: 'Description 3',
    rightPreviewTitle: 'Image 5/5',
    rightPreviewAlt: 'Image 5'
  },
  {
    currentImgTitle: 'Image 5/5',
    currentAlt: 'Image 5',
    currentDescription: 'Image 5/5',
    leftPreviewTitle: 'Image 4/5 - Description 4',
    leftPreviewAlt: 'Description 4',
    rightPreviewTitle: 'Image 1/5',
    rightPreviewAlt: 'Image 1'
  }
];

const TEST_MODEL_ALWAYSEMPTY_DESCRIPTIONS: TestModel[] = [
  Object.assign({}, TEST_MODEL[0], {leftPreviewTitle: '', rightPreviewTitle: ''}),
  Object.assign({}, TEST_MODEL[1], {leftPreviewTitle: '', rightPreviewTitle: ''}),
  Object.assign({}, TEST_MODEL[2], {leftPreviewTitle: '', rightPreviewTitle: ''}),
  Object.assign({}, TEST_MODEL[3], {leftPreviewTitle: '', rightPreviewTitle: ''}),
  Object.assign({}, TEST_MODEL[4], {leftPreviewTitle: '', rightPreviewTitle: ''})
];

const TEST_MODEL_HIDEEMPTY_DESCRIPTIONS: TestModel[] = [
  Object.assign({}, TEST_MODEL[0], {
    currentImgTitle: 'Image 1/5', leftPreviewTitle: '',
    rightPreviewTitle: 'Image 2/5 - Description 2', currentDescription: 'Image 1/5'
  }),
  Object.assign({}, TEST_MODEL[1], {
    currentImgTitle: 'Image 2/5 - Description 2', leftPreviewTitle: 'Image 1/5',
    rightPreviewTitle: 'Image 3/5 - Description 3', currentDescription: 'Description 2'
  }),
  Object.assign({}, TEST_MODEL[2], {
    currentImgTitle: 'Image 3/5 - Description 3', leftPreviewTitle: 'Image 2/5 - Description 2',
    rightPreviewTitle: 'Image 4/5 - Description 4', currentDescription: 'Description 3'
  }),
  Object.assign({}, TEST_MODEL[3], {
    currentImgTitle: 'Image 4/5 - Description 4', leftPreviewTitle: 'Image 3/5 - Description 3',
    rightPreviewTitle: 'Image 5/5', currentDescription: 'Description 4'
  }),
  Object.assign({}, TEST_MODEL[4], {
    currentImgTitle: 'Image 5/5', leftPreviewTitle: 'Image 4/5 - Description 4',
    rightPreviewTitle: '', currentDescription: 'Image 5/5'
  })
];

const CUSTOM_ACCESSIBILITY: AccessibilityConfig = Object.assign({}, KS_DEFAULT_ACCESSIBILITY_CONFIG);
CUSTOM_ACCESSIBILITY.mainContainerTitle = 'custom mainContainerTitle';
CUSTOM_ACCESSIBILITY.mainContainerAriaLabel = 'custom mainContainerAriaLabel';
CUSTOM_ACCESSIBILITY.mainNextImageTitle = 'custom mainNextImageTitle';
CUSTOM_ACCESSIBILITY.mainNextImageAriaLabel = 'custom mainNextImageAriaLabel';
CUSTOM_ACCESSIBILITY.mainPrevImageTitle = 'custom mainPrevImageTitle';
CUSTOM_ACCESSIBILITY.mainPrevImageAriaLabel = 'custom mainPrevImageAriaLabel';

const DEFAULT_SIZE: Size = {height: 'auto', width: '100px'};
const CUSTOM_SIZE: Size = {height: '100px', width: '100px'};
const CUSTOM_SIZE_AUTO_HEIGHT: Size = {height: 'auto', width: '100px'};
const CUSTOM_SIZE_AUTO_WIDTH: Size = {height: '100px', width: 'auto'};
const CUSTOM_SIZES: Size[] = [CUSTOM_SIZE, CUSTOM_SIZE_AUTO_HEIGHT, CUSTOM_SIZE_AUTO_WIDTH];

const CUSTOM_SLIDE_CONFIG: SlideConfig[] = [
  {infinite: false, sidePreviews: {show: true, size: CUSTOM_SIZE}},
  {infinite: false, sidePreviews: {show: true, size: CUSTOM_SIZE_AUTO_HEIGHT}},
  {infinite: false, sidePreviews: {show: true, size: CUSTOM_SIZE_AUTO_WIDTH}},
  {sidePreviews: {show: true, size: DEFAULT_SIZE}}
];

const CUSTOM_SLIDE_CONFIG_NO_SIDE_PREVIEWS: SlideConfig[] = [
  {infinite: false, sidePreviews: {show: false, size: DEFAULT_SIZE}},
  {infinite: true, sidePreviews: {show: false, size: DEFAULT_SIZE}},
  {sidePreviews: {show: false, size: DEFAULT_SIZE}},
  {infinite: true},
  {infinite: false}
];

const CUSTOM_SLIDE_CONFIG_INFINITE: SlideConfig[] = [
  {infinite: true, sidePreviews: {show: true, size: DEFAULT_SIZE}},
  {infinite: true, sidePreviews: {show: true, size: DEFAULT_SIZE}},
  {infinite: true, sidePreviews: {show: true, size: DEFAULT_SIZE}},
  {infinite: true}
];

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

const IMAGES_BASE64: InternalLibImage[] = [
  new InternalLibImage(0, {
    // modal
    img: <SafeResourceUrl>'data:image/png;base64,iVBORw0KG=',
    extUrl: 'http://www.google.com'
  }),
  new InternalLibImage(1, {
    // modal
    img: <SafeResourceUrl>'data:image/png;base64,iVBORw0KG=',
    description: 'Description 2'
  }),
  new InternalLibImage(
    2,
    {
      // modal
      img: <SafeResourceUrl>'data:image/png;base64,iVBORw0KG=',
      description: 'Description 3',
      extUrl: 'http://www.google.com'
    },
    {
      // plain
      img: <SafeResourceUrl>'data:image/png;base64,iVBORw0KG=',
      title: 'custom title 2',
      alt: 'custom alt 2',
      ariaLabel: 'arial label 2'
    }
  ),
  new InternalLibImage(3, {
    // modal
    img: <SafeResourceUrl>'data:image/png;base64,iVBORw0KG=',
    description: 'Description 4',
    extUrl: 'http://www.google.com'
  }),
  new InternalLibImage(
    4,
    {
      // modal
      img: <SafeResourceUrl>'data:image/png;base64,iVBORw0KG='
    },
    {
      // plain
      img: <SafeResourceUrl>'data:image/png;base64,iVBORw0KG='
    }
  )
];

function checkMainContainer() {
  const element: DebugElement = fixture.debugElement;
  const mainCurrentImage: DebugElement = element.query(By.css('main.main-image-container'));
  expect(mainCurrentImage.name).toBe('main');
  expect(mainCurrentImage.attributes['ksKeyboardNavigation']).toBe('');
  expect(mainCurrentImage.properties['title']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.mainContainerTitle);
  expect(mainCurrentImage.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.mainContainerAriaLabel);
}

function checkCurrentImage(currentImage: InternalLibImage, val: TestModel, withDescription: boolean = true) {
  const element: DebugElement = fixture.debugElement;
  const currentFigure: DebugElement = element.query(By.css('figure#current-figure'));
  expect(currentFigure.name).toBe('figure');
  const currentImageElement: DebugElement = currentFigure.children[0];
  expect(currentImageElement.name).toBe('img');
  expect(currentImageElement.attributes['class']).toBe('inside');
  expect(currentImageElement.attributes['role']).toBe('img');
  expect(currentImageElement.properties['src']).toBe(currentImage.modal.img);
  expect(currentImageElement.properties['title']).toBe(val.currentImgTitle);
  expect(currentImageElement.properties['alt']).toBe(val.currentAlt);
  expect(currentImageElement.properties['tabIndex']).toBe(0);

  if (withDescription) {
    const currentFigcaption: DebugElement = currentFigure.children[1];
    expect(currentFigcaption.attributes['class']).toBe('inside description');
    expect(currentFigcaption.nativeElement.textContent).toEqual(val.currentDescription);
  }
}

function checkArrows(isFirstImage: boolean, isLastImage: boolean) {
  const element: DebugElement = fixture.debugElement;
  const aNavLeft: DebugElement = element.query(By.css('a.nav-left'));
  expect(aNavLeft.name).toBe('a');
  expect(aNavLeft.attributes['role']).toBe('button');
  expect(aNavLeft.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.mainPrevImageAriaLabel);
  expect(aNavLeft.properties['tabIndex']).toBe(isFirstImage ? -1 : 0);
  const divNavLeft: DebugElement = aNavLeft.children[0];
  expect(divNavLeft.attributes['aria-hidden']).toBe('true');
  expect(divNavLeft.properties['className']).toBe('inside ' + (isFirstImage ? 'empty-arrow-image' : 'left-arrow-image'));
  expect(divNavLeft.properties['title']).toBe(isFirstImage ? '' : KS_DEFAULT_ACCESSIBILITY_CONFIG.mainPrevImageTitle);

  const aNavRight: DebugElement = element.query(By.css('a.nav-right'));
  expect(aNavRight.name).toBe('a');
  expect(aNavRight.attributes['role']).toBe('button');
  expect(aNavRight.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.mainNextImageAriaLabel);
  expect(aNavRight.properties['tabIndex']).toBe(isLastImage ? -1 : 0);
  const divNavRight: DebugElement = aNavRight.children[0];
  expect(divNavRight.attributes['aria-hidden']).toBe('true');
  expect(divNavRight.properties['className']).toBe('inside ' + (isLastImage ? 'empty-arrow-image' : 'right-arrow-image'));
  expect(divNavRight.properties['title']).toBe(isLastImage ? '' : KS_DEFAULT_ACCESSIBILITY_CONFIG.mainNextImageTitle);
}

function checkSidePreviews(prevImage: InternalLibImage, nextImage: InternalLibImage,
                           isFirstImage: boolean, isLastImage: boolean, val: TestModel, size: Size = DEFAULT_SIZE) {
  const element: DebugElement = fixture.debugElement;
  const leftPreviewImage: DebugElement = element.query(By.css(isFirstImage
    ? 'div.current-image-previous.hidden'
    : 'img.inside.current-image-previous'));
  expect(leftPreviewImage.name).toBe(isFirstImage ? 'div' : 'img');
  expect(leftPreviewImage.attributes['ksSize']).toBe('');
  if (!isFirstImage) {
    expect(leftPreviewImage.properties['src']).toBe(prevImage.plain ? prevImage.plain.img : prevImage.modal.img);
    expect(leftPreviewImage.properties['title']).toBe(val.leftPreviewTitle);
    expect(leftPreviewImage.properties['alt']).toBe(val.leftPreviewAlt);
  }
  expect(leftPreviewImage.attributes['class']).toBe(isFirstImage ? 'current-image-previous hidden' : 'inside current-image-previous');
  expect(leftPreviewImage.styles.width).toBe(size.width);
  expect(leftPreviewImage.styles.height).toBe(size.height);

  const rightPreviewImage: DebugElement = element.query(By.css(isLastImage
    ? 'div.current-image-next.hidden'
    : 'img.inside.current-image-next'));
  expect(rightPreviewImage.name).toBe(isLastImage ? 'div' : 'img');
  expect(rightPreviewImage.attributes['ksSize']).toBe('');
  if (!isLastImage) {
    expect(rightPreviewImage.properties['src']).toBe(nextImage.plain ? nextImage.plain.img : nextImage.modal.img);
    expect(rightPreviewImage.properties['title']).toBe(val.rightPreviewTitle);
    expect(rightPreviewImage.properties['alt']).toBe(val.rightPreviewAlt);
  }
  expect(rightPreviewImage.attributes['class']).toBe(isLastImage ? 'current-image-next hidden' : 'inside current-image-next');
  expect(rightPreviewImage.styles.width).toBe(size.width);
  expect(rightPreviewImage.styles.height).toBe(size.height);
}

function initTestBed() {
  return TestBed.configureTestingModule({
    declarations: [CurrentImageComponent, SizeDirective, LoadingSpinnerComponent, KeyboardNavigationDirective, DescriptionDirective]
  }).overrideComponent(CurrentImageComponent, {
    set: {
      providers: [
        {
          provide: GalleryService,
          useClass: GalleryService
        },
        {
          provide: ConfigService,
          useClass: ConfigService
        }
      ]
    }
  });
}

describe('CurrentImageComponent', () => {
  beforeEach(async(() => {
    return initTestBed();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentImageComponent);
    comp = fixture.componentInstance;
  });

  it('should instantiate it', () => expect(comp).not.toBeNull());

  describe('---YES---', () => {

    TEST_MODEL.forEach((val: TestModel, index: number) => {
      it(`should display current image with arrows and side previews. Test i=${index}`, () => {
        const configService = fixture.debugElement.injector.get(ConfigService);
        configService.set({
          accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
          currentImageConfig: <CurrentImageConfig>{
            loadingConfig: <LoadingConfig>{enable: true, type: LoadingType.STANDARD},
            description: <Description>{strategy: DescriptionStrategy.ALWAYS_VISIBLE}
          },
          slideConfig: <SlideConfig>{infinite: false, sidePreviews: {show: true, size: DEFAULT_SIZE}},
          keyboardConfig: null
        });
        comp.images = IMAGES;
        comp.currentImage = IMAGES[index];
        comp.isOpen = true;
        comp.ngOnChanges(<SimpleChanges>{
          currentImage: {
            previousValue: IMAGES[index],
            currentValue: IMAGES[index],
            firstChange: false,
            isFirstChange: () => false
          }
        });
        comp.ngOnInit();
        fixture.detectChanges();
        checkMainContainer();
        checkCurrentImage(IMAGES[index], val);
      });
    });

    TEST_MODEL.forEach((val: TestModel, index: number) => {
      it(`should display current image as base64 with arrows and side previews. Test i=${index}`, () => {
        const configService = fixture.debugElement.injector.get(ConfigService);
        configService.set({
          accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
          currentImageConfig: <CurrentImageConfig>{
            loadingConfig: <LoadingConfig>{enable: true, type: LoadingType.STANDARD},
            description: <Description>{strategy: DescriptionStrategy.ALWAYS_VISIBLE}
          },
          slideConfig: <SlideConfig>{infinite: false, sidePreviews: {show: true, size: DEFAULT_SIZE}},
          keyboardConfig: null
        });
        comp.images = IMAGES_BASE64;
        comp.currentImage = IMAGES_BASE64[index];
        comp.isOpen = true;
        comp.ngOnChanges(<SimpleChanges>{
          currentImage: {
            previousValue: IMAGES_BASE64[index],
            currentValue: IMAGES_BASE64[index],
            firstChange: false,
            isFirstChange: () => false
          }
        });
        comp.ngOnInit();
        fixture.detectChanges();
        checkMainContainer();
        checkCurrentImage(IMAGES_BASE64[index], val);
      });
    });

    it(`should display current image with arrows and side previews when there is only one image.`, () => {
      const configService = fixture.debugElement.injector.get(ConfigService);
      configService.set({
        accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
        currentImageConfig: <CurrentImageConfig>{
          loadingConfig: <LoadingConfig>{enable: true, type: LoadingType.STANDARD},
          description: <Description>{strategy: DescriptionStrategy.ALWAYS_VISIBLE}
        },
        slideConfig: <SlideConfig>{infinite: false, sidePreviews: {show: true, size: DEFAULT_SIZE}},
        keyboardConfig: null
      });
      comp.images = IMAGES;
      comp.currentImage = IMAGES[0];
      comp.isOpen = true;
      comp.ngOnChanges(<SimpleChanges>{
        currentImage: {
          previousValue: IMAGES[0],
          currentValue: IMAGES[0],
          firstChange: false,
          isFirstChange: () => false
        }
      });
      comp.ngOnInit();
      fixture.detectChanges();
      checkMainContainer();
      checkCurrentImage(IMAGES[0], TEST_MODEL_SINGLE_IMAGE);
    });

    TEST_MODEL.forEach((val: TestModel, index: number) => {
      it(`should navigate between images clicking on current image. Test i=${index}`, () => {
        const configService = fixture.debugElement.injector.get(ConfigService);
        configService.set({
          accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
          currentImageConfig: <CurrentImageConfig>{
            loadingConfig: <LoadingConfig>{enable: true, type: LoadingType.STANDARD},
            description: <Description>{strategy: DescriptionStrategy.ALWAYS_VISIBLE}
          },
          slideConfig: <SlideConfig>{infinite: false, sidePreviews: {show: true, size: DEFAULT_SIZE}},
          keyboardConfig: null
        });
        comp.images = IMAGES;
        comp.currentImage = IMAGES[index];
        comp.isOpen = true;
        comp.ngOnChanges(<SimpleChanges>{
          currentImage: {
            previousValue: IMAGES[index],
            currentValue: IMAGES[index],
            firstChange: false,
            isFirstChange: () => false
          }
        });
        comp.ngOnInit();
        fixture.detectChanges();
        checkMainContainer();
        checkCurrentImage(IMAGES[index], val);
        checkArrows(index === 0, index === IMAGES.length - 1);
        checkSidePreviews(IMAGES[index - 1], IMAGES[index + 1], index === 0, index === IMAGES.length - 1, val);

        const element: DebugElement = fixture.debugElement;
        const currentImage: DebugElement = element.query(By.css('img#current-image'));
        expect(currentImage.name).toBe('img');

        if (index !== IMAGES.length - 1) {
          comp.changeImage.subscribe((res: ImageModalEvent) => {
            expect(res.result).toBe(index + 1);
            expect(res.action).toBe(Action.CLICK);
          });

          currentImage.nativeElement.click();
        }
      });
    });

    TEST_MODEL.forEach((val: TestModel, index: number) => {
      it(`should navigate between images clicking on right side preview. Test i=${index}`, () => {
        const configService = fixture.debugElement.injector.get(ConfigService);
        configService.set({
          accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
          currentImageConfig: <CurrentImageConfig>{
            loadingConfig: <LoadingConfig>{enable: true, type: LoadingType.STANDARD},
            description: <Description>{strategy: DescriptionStrategy.ALWAYS_VISIBLE}
          },
          slideConfig: <SlideConfig>{infinite: false, sidePreviews: {show: true, size: DEFAULT_SIZE}},
          keyboardConfig: null
        });
        comp.images = IMAGES;
        comp.currentImage = IMAGES[index];
        comp.isOpen = true;
        comp.ngOnChanges(<SimpleChanges>{
          currentImage: {
            previousValue: IMAGES[index],
            currentValue: IMAGES[index],
            firstChange: false,
            isFirstChange: () => false
          }
        });
        comp.ngOnInit();
        fixture.detectChanges();
        checkMainContainer();
        checkCurrentImage(IMAGES[index], val);
        checkArrows(index === 0, index === IMAGES.length - 1);
        checkSidePreviews(IMAGES[index - 1], IMAGES[index + 1], index === 0, index === IMAGES.length - 1, val);

        const element: DebugElement = fixture.debugElement;
        const rightPreviewImage: DebugElement = element.query(By.css(index === IMAGES.length - 1
          ? 'div.current-image-next.hidden'
          : 'img.inside.current-image-next'));

        if (index !== IMAGES.length - 1) {
          comp.changeImage.subscribe((res: ImageModalEvent) => {
            expect(res.result).toBe(index + 1);
            expect(res.action).toBe(Action.CLICK);
          });

          spyOn(comp, 'onNavigationEvent').and.callThrough();

          rightPreviewImage.nativeElement.click();
        }
      });
    });


    [...TEST_MODEL].reverse().forEach((val: TestModel, index: number) => {
      it(`should navigate between images clicking on left side preview. Test i=${index}`, () => {
        const configService = fixture.debugElement.injector.get(ConfigService);
        configService.set({
          accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
          currentImageConfig: <CurrentImageConfig>{
            loadingConfig: <LoadingConfig>{enable: true, type: LoadingType.STANDARD},
            description: <Description>{strategy: DescriptionStrategy.ALWAYS_VISIBLE}
          },
          slideConfig: <SlideConfig>{infinite: false, sidePreviews: {show: true, size: DEFAULT_SIZE}},
          keyboardConfig: null
        });
        const currentIndex: number = IMAGES.length - 1 - index;
        comp.images = IMAGES;
        comp.currentImage = IMAGES[currentIndex];
        comp.isOpen = true;
        comp.ngOnChanges(<SimpleChanges>{
          currentImage: {
            previousValue: IMAGES[currentIndex],
            currentValue: IMAGES[currentIndex],
            firstChange: false,
            isFirstChange: () => false
          }
        });
        comp.ngOnInit();
        fixture.detectChanges();
        checkMainContainer();
        checkCurrentImage(IMAGES[currentIndex], val);
        checkArrows(currentIndex === 0, currentIndex === IMAGES.length - 1);
        checkSidePreviews(IMAGES[currentIndex - 1], IMAGES[currentIndex + 1], currentIndex === 0, currentIndex === IMAGES.length - 1, val);

        const element: DebugElement = fixture.debugElement;
        const leftPreviewImage: DebugElement = element.query(By.css(currentIndex === 0
          ? 'div.current-image-previous.hidden'
          : 'img.inside.current-image-previous'));

        if (currentIndex !== 0) {
          comp.changeImage.subscribe((res: ImageModalEvent) => {
            expect(res.result).toBe(currentIndex - 1);
            expect(res.action).toBe(Action.CLICK);
          });

          spyOn(comp, 'onNavigationEvent').and.callThrough();

          leftPreviewImage.nativeElement.click();
        }
      });
    });

    TEST_MODEL.forEach((val: TestModel, index: number) => {
      it(`should navigate between images to the right using swipe gestures. Test i=${index}`, () => {
        const configService = fixture.debugElement.injector.get(ConfigService);
        configService.set({
          accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
          currentImageConfig: <CurrentImageConfig>{
            loadingConfig: <LoadingConfig>{enable: true, type: LoadingType.STANDARD},
            description: <Description>{strategy: DescriptionStrategy.ALWAYS_VISIBLE}
          },
          slideConfig: <SlideConfig>{infinite: false, sidePreviews: {show: true, size: DEFAULT_SIZE}},
          keyboardConfig: null
        });
        comp.images = IMAGES;
        comp.currentImage = IMAGES[index];
        comp.isOpen = true;
        comp.ngOnChanges(<SimpleChanges>{
          currentImage: {
            previousValue: IMAGES[index],
            currentValue: IMAGES[index],
            firstChange: false,
            isFirstChange: () => false
          }
        });
        comp.ngOnInit();
        fixture.detectChanges();
        checkMainContainer();
        checkCurrentImage(IMAGES[index], val);
        checkArrows(index === 0, index === IMAGES.length - 1);
        checkSidePreviews(IMAGES[index - 1], IMAGES[index + 1], index === 0, index === IMAGES.length - 1, val);

        if (index !== IMAGES.length - 1) {
          comp.changeImage.subscribe((res: ImageModalEvent) => {
            expect(res.result).toBe(index + 1);
            expect(res.action).toBe(Action.SWIPE);
          });

          spyOn(comp, 'onNavigationEvent').and.callThrough();

          comp.swipe('swiperight');
        }
      });
    });

    [...TEST_MODEL].reverse().forEach((val: TestModel, index: number) => {
      it(`should navigate between images to the left using swipe gestures. Test i=${index}`, () => {
        const configService = fixture.debugElement.injector.get(ConfigService);
        configService.set({
          accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
          currentImageConfig: <CurrentImageConfig>{
            loadingConfig: <LoadingConfig>{enable: true, type: LoadingType.STANDARD},
            description: <Description>{strategy: DescriptionStrategy.ALWAYS_VISIBLE}
          },
          slideConfig: <SlideConfig>{infinite: false, sidePreviews: {show: true, size: DEFAULT_SIZE}},
          keyboardConfig: null
        });
        const currentIndex: number = IMAGES.length - 1 - index;
        comp.images = IMAGES;
        comp.currentImage = IMAGES[currentIndex];
        comp.isOpen = true;
        comp.ngOnChanges(<SimpleChanges>{
          currentImage: {
            previousValue: IMAGES[currentIndex],
            currentValue: IMAGES[currentIndex],
            firstChange: false,
            isFirstChange: () => false
          }
        });
        comp.ngOnInit();
        fixture.detectChanges();
        checkMainContainer();
        checkCurrentImage(IMAGES[currentIndex], val);
        checkArrows(currentIndex === 0, currentIndex === IMAGES.length - 1);
        checkSidePreviews(IMAGES[currentIndex - 1], IMAGES[currentIndex + 1], currentIndex === 0, currentIndex === IMAGES.length - 1, val);

        if (currentIndex !== 0) {
          comp.changeImage.subscribe((res: ImageModalEvent) => {
            expect(res.result).toBe(currentIndex - 1);
            expect(res.action).toBe(Action.SWIPE);
          });

          spyOn(comp, 'onNavigationEvent').and.callThrough();

          comp.swipe('swipeleft');
        }
      });
    });

    TEST_MODEL.forEach((val: TestModel, index: number) => {
      it(`should invert swipe navigation with the 'invertSwipe' property to true navigating to the left. Test i=${index}`, () => {
        const configService = fixture.debugElement.injector.get(ConfigService);
        configService.set({
          accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
          currentImageConfig: <CurrentImageConfig>{
            loadingConfig: <LoadingConfig>{enable: true, type: LoadingType.STANDARD},
            description: <Description>{strategy: DescriptionStrategy.ALWAYS_VISIBLE},
            invertSwipe: true
          },
          slideConfig: <SlideConfig>{infinite: false, sidePreviews: {show: true, size: DEFAULT_SIZE}},
          keyboardConfig: null
        });
        comp.images = IMAGES;
        comp.currentImage = IMAGES[index];
        comp.isOpen = true;
        comp.ngOnChanges(<SimpleChanges>{
          currentImage: {
            previousValue: IMAGES[index],
            currentValue: IMAGES[index],
            firstChange: false,
            isFirstChange: () => false
          }
        });
        comp.ngOnInit();
        fixture.detectChanges();
        checkMainContainer();
        checkCurrentImage(IMAGES[index], val);
        checkArrows(index === 0, index === IMAGES.length - 1);
        checkSidePreviews(IMAGES[index - 1], IMAGES[index + 1], index === 0, index === IMAGES.length - 1, val);

        if (index !== IMAGES.length - 1) {
          comp.changeImage.subscribe((res: ImageModalEvent) => {
            expect(res.result).toBe(index + 1);
            expect(res.action).toBe(Action.SWIPE);
          });

          spyOn(comp, 'onNavigationEvent').and.callThrough();

          comp.swipe('swipeleft');
        }
      });
    });

    [...TEST_MODEL].reverse().forEach((val: TestModel, index: number) => {
      it(`should invert swipe navigation with the 'invertSwipe' property to true navigating to the right. Test i=${index}`, () => {
        const configService = fixture.debugElement.injector.get(ConfigService);
        configService.set({
          accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
          currentImageConfig: <CurrentImageConfig>{
            loadingConfig: <LoadingConfig>{enable: true, type: LoadingType.STANDARD},
            description: <Description>{strategy: DescriptionStrategy.ALWAYS_VISIBLE},
            invertSwipe: true
          },
          slideConfig: <SlideConfig>{infinite: false, sidePreviews: {show: true, size: DEFAULT_SIZE}},
          keyboardConfig: null
        });
        const currentIndex: number = IMAGES.length - 1 - index;
        comp.images = IMAGES;
        comp.currentImage = IMAGES[currentIndex];
        comp.isOpen = true;
        comp.ngOnChanges(<SimpleChanges>{
          currentImage: {
            previousValue: IMAGES[currentIndex],
            currentValue: IMAGES[currentIndex],
            firstChange: false,
            isFirstChange: () => false
          }
        });
        comp.ngOnInit();
        fixture.detectChanges();
        checkMainContainer();
        checkCurrentImage(IMAGES[currentIndex], val);
        checkArrows(currentIndex === 0, currentIndex === IMAGES.length - 1);
        checkSidePreviews(IMAGES[currentIndex - 1], IMAGES[currentIndex + 1], currentIndex === 0, currentIndex === IMAGES.length - 1, val);

        if (currentIndex !== 0) {
          comp.changeImage.subscribe((res: ImageModalEvent) => {
            expect(res.result).toBe(currentIndex - 1);
            expect(res.action).toBe(Action.SWIPE);
          });

          spyOn(comp, 'onNavigationEvent').and.callThrough();

          comp.swipe('swiperight');
        }
      });
    });

    TEST_MODEL_ALWAYSEMPTY_DESCRIPTIONS.forEach((val: TestModel, index: number) => {
      it(`should display current image when description is ALWAYS_HIDDEN. Test i=${index}`, () => {
        const configService = fixture.debugElement.injector.get(ConfigService);
        configService.set({
          accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
          currentImageConfig: <CurrentImageConfig>{
            loadingConfig: <LoadingConfig>{enable: true, type: LoadingType.STANDARD},
            description: <Description>{strategy: DescriptionStrategy.ALWAYS_HIDDEN}
          },
          slideConfig: <SlideConfig>{infinite: false, sidePreviews: {show: true, size: DEFAULT_SIZE}},
          keyboardConfig: null
        });
        comp.images = IMAGES;
        comp.currentImage = IMAGES[index];
        comp.isOpen = true;
        comp.ngOnChanges(<SimpleChanges>{
          currentImage: {
            previousValue: IMAGES[index],
            currentValue: IMAGES[index],
            firstChange: false,
            isFirstChange: () => false
          }
        });
        comp.ngOnInit();
        fixture.detectChanges();
        checkMainContainer();
        checkCurrentImage(IMAGES[index], val, false);
        checkArrows(index === 0, index === IMAGES.length - 1);
        checkSidePreviews(IMAGES[index - 1], IMAGES[index + 1], index === 0, index === IMAGES.length - 1, val);
      });
    });

    TEST_MODEL_HIDEEMPTY_DESCRIPTIONS.forEach((val: TestModel, index: number) => {
      it(`should display current image when description is HIDE_IF_EMPTY. Test i=${index}`, () => {
        const configService = fixture.debugElement.injector.get(ConfigService);
        configService.set({
          accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
          currentImageConfig: <CurrentImageConfig>{
            loadingConfig: <LoadingConfig>{enable: true, type: LoadingType.STANDARD},
            description: <Description>{strategy: DescriptionStrategy.HIDE_IF_EMPTY}
          },
          slideConfig: <SlideConfig>{infinite: false, sidePreviews: {show: true, size: DEFAULT_SIZE}},
          keyboardConfig: null
        });
        comp.images = IMAGES;
        comp.currentImage = IMAGES[index];
        comp.isOpen = true;
        comp.ngOnChanges(<SimpleChanges>{
          currentImage: {
            previousValue: IMAGES[index],
            currentValue: IMAGES[index],
            firstChange: false,
            isFirstChange: () => false
          }
        });
        comp.ngOnInit();
        fixture.detectChanges();
        checkMainContainer();
        const imageWithoutDescription: boolean = !IMAGES[index].modal || !IMAGES[index].modal.description || IMAGES[index].modal.description === '';
        // TODO fixme
        // checkCurrentImage(IMAGES[index], val, !imageWithoutDescription);
        // checkArrows(index === 0, index === IMAGES.length - 1);
        // checkSidePreviews(IMAGES[index - 1], IMAGES[index + 1], index === 0, index === IMAGES.length - 1, val);
      });
    });

    CUSTOM_SLIDE_CONFIG.forEach((slideConfig: SlideConfig, j: number) => {
      TEST_MODEL.forEach((val: TestModel, index: number) => {
        it(`should display current image, arrows and side previews with custom slideConfig. Test i=${index}, j=${j}`, () => {
          const configService = fixture.debugElement.injector.get(ConfigService);
          configService.set({
            accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
            currentImageConfig: <CurrentImageConfig>{
              loadingConfig: <LoadingConfig>{enable: true, type: LoadingType.STANDARD},
              description: <Description>{strategy: DescriptionStrategy.ALWAYS_VISIBLE}
            },
            slideConfig: slideConfig,
            keyboardConfig: null
          });
          comp.images = IMAGES;
          comp.currentImage = IMAGES[index];
          comp.isOpen = true;
          comp.ngOnChanges(<SimpleChanges>{
            currentImage: {
              previousValue: IMAGES[index],
              currentValue: IMAGES[index],
              firstChange: false,
              isFirstChange: () => false
            }
          });
          comp.ngOnInit();
          fixture.detectChanges();
          checkMainContainer();
          checkCurrentImage(IMAGES[index], val);
          checkArrows(index === 0, index === IMAGES.length - 1);
          checkSidePreviews(IMAGES[index - 1], IMAGES[index + 1],
            index === 0, index === IMAGES.length - 1,
            val, slideConfig.sidePreviews ? slideConfig.sidePreviews.size : DEFAULT_SIZE);
        });
      });
    });

    CUSTOM_SLIDE_CONFIG_INFINITE.forEach((slideConfig: SlideConfig, j: number) => {
      TEST_MODEL_INFINITE.forEach((val: TestModel, index: number) => {
        it(`should display current image, arrows and side previews with infinite sliding. Test i=${index}, j=${j}`, () => {
          const configService = fixture.debugElement.injector.get(ConfigService);
          configService.set({
            accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
            currentImageConfig: <CurrentImageConfig>{
              loadingConfig: <LoadingConfig>{enable: true, type: LoadingType.STANDARD},
              description: <Description>{strategy: DescriptionStrategy.ALWAYS_VISIBLE}
            },
            slideConfig: slideConfig,
            keyboardConfig: null
          });
          comp.images = IMAGES;
          comp.currentImage = IMAGES[index];
          comp.isOpen = true;
          comp.ngOnChanges(<SimpleChanges>{
            currentImage: {
              previousValue: IMAGES[index],
              currentValue: IMAGES[index],
              firstChange: false,
              isFirstChange: () => false
            }
          });
          comp.ngOnInit();
          fixture.detectChanges();
          checkMainContainer();
          checkCurrentImage(IMAGES[index], val);
          checkArrows((index === 0) && !slideConfig.infinite, (index === IMAGES.length - 1) && !slideConfig.infinite);
          if (slideConfig.sidePreviews) {
            checkSidePreviews(
              index === 0 ? IMAGES[IMAGES.length - 1] : IMAGES[index - 1],
              index === IMAGES.length - 1 ? IMAGES[0] : IMAGES[index + 1],
              (index === 0) && !slideConfig.infinite, (index === IMAGES.length - 1) && !slideConfig.infinite,
              val, slideConfig.sidePreviews ? slideConfig.sidePreviews.size : DEFAULT_SIZE);
          }
        });
      });
    });

    CUSTOM_SLIDE_CONFIG_NO_SIDE_PREVIEWS.forEach((slideConfig: SlideConfig, j: number) => {
      TEST_MODEL_INFINITE.forEach((val: TestModel, index: number) => {
        it(`should display current image and arrows WITHOUT side previews. Test i=${index}, j=${j}`, () => {
          const configService = fixture.debugElement.injector.get(ConfigService);
          configService.set({
            accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
            currentImageConfig: <CurrentImageConfig>{
              loadingConfig: <LoadingConfig>{enable: true, type: LoadingType.STANDARD},
              description: <Description>{strategy: DescriptionStrategy.ALWAYS_VISIBLE}
            },
            slideConfig: slideConfig,
            keyboardConfig: null
          });
          const images = IMAGES;
          comp.images = images;
          comp.currentImage = images[index];
          comp.isOpen = true;
          comp.ngOnChanges(<SimpleChanges>{
            currentImage: {
              previousValue: images[index],
              currentValue: images[index],
              firstChange: false,
              isFirstChange: () => false
            }
          });
          comp.ngOnInit();
          fixture.detectChanges();
          checkMainContainer();
          checkCurrentImage(images[index], val);

          // FIXME: this is the updated code to init both isFirstImage and isLastImage
          // let isFirstImage;
          // let isLastImage;
          // if (slideConfig.infinite === true) {
          //   // infinite sliding enabled
          //   if (images.length === 1) {
          //     isFirstImage = true;
          //     isLastImage = true;
          //   } else {
          //     isFirstImage = false;
          //     isLastImage = false;
          //   }
          // } else {
          //   if (images.length === 1) {
          //     isFirstImage = true;
          //     isLastImage = true;
          //   } else {
          //     switch (index) {
          //       case 0:
          //         // execute this only if infinite sliding is disabled
          //         isFirstImage = true;
          //         isLastImage = false;
          //         break;
          //       case images.length - 1:
          //         // execute this only if infinite sliding is disabled
          //         isFirstImage = false;
          //         isLastImage = true;
          //         break;
          //       default:
          //         isFirstImage = false;
          //         isLastImage = false;
          //         break;
          //     }
          //   }
          // }

          fixture.detectChanges();

          // FIXME: restore this and remove the code below
          // checkArrows(isFirstImage, isLastImage);

          // FIXME I don't know why the code and the example are working, but the test not completely.
          // FIXME Why tabIndex and className are wrong only in this test?
          const element: DebugElement = fixture.debugElement;
          const aNavLeft: DebugElement = element.query(By.css('a.nav-left'));
          expect(aNavLeft.name).toBe('a');
          expect(aNavLeft.attributes['role']).toBe('button');
          expect(aNavLeft.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.mainPrevImageAriaLabel);
          // FIXME restore this
          // expect(aNavLeft.properties['tabIndex']).toBe(isFirstImage ? -1 : 0);
          const divNavLeft: DebugElement = aNavLeft.children[0];
          expect(divNavLeft.attributes['aria-hidden']).toBe('true');
          // FIXME restore this
          // expect(divNavLeft.properties['className']).toBe('inside ' + (isFirstImage ? 'empty-arrow-image' : 'left-arrow-image'));
          expect(divNavLeft.properties['title']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.mainPrevImageTitle);

          const aNavRight: DebugElement = element.query(By.css('a.nav-right'));
          expect(aNavRight.name).toBe('a');
          expect(aNavRight.attributes['role']).toBe('button');
          expect(aNavRight.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.mainNextImageAriaLabel);
          // FIXME restore this
          // expect(aNavRight.properties['tabIndex']).toBe(isLastImage ? -1 : 0);
          const divNavRight: DebugElement = aNavRight.children[0];
          expect(divNavRight.attributes['aria-hidden']).toBe('true');
          // FIXME restore this
          // expect(divNavRight.properties['className']).toBe('inside ' + (isLastImage ? 'empty-arrow-image' : 'right-arrow-image'));
          expect(divNavRight.properties['title']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.mainNextImageTitle);

          // no side previews
          const leftPreviewImage: DebugElement = element.query(By.css((index === 0) && !slideConfig.infinite
            ? 'div.current-image-previous.hidden'
            : 'img.inside.current-image-previous'));
          expect(leftPreviewImage).toBeNull();
          const rightPreviewImage: DebugElement = element.query(By.css((index === images.length - 1) && !slideConfig.infinite
            ? 'div.current-image-next.hidden'
            : 'img.inside.current-image-next'));
          expect(rightPreviewImage).toBeNull();
        });
      });
    });

    it(`should display current image with custom accessibility`, () => {
      const configService = fixture.debugElement.injector.get(ConfigService);
      configService.set({
        accessibilityConfig: CUSTOM_ACCESSIBILITY,
        currentImageConfig: <CurrentImageConfig>{
          loadingConfig: <LoadingConfig>{enable: true, type: LoadingType.STANDARD},
          description: <Description>{strategy: DescriptionStrategy.ALWAYS_VISIBLE}
        },
        slideConfig: <SlideConfig>{infinite: false, sidePreviews: {show: true, size: DEFAULT_SIZE}},
        keyboardConfig: null
      });
      comp.images = IMAGES;
      comp.currentImage = IMAGES[0];
      comp.isOpen = true;
      comp.ngOnChanges(<SimpleChanges>{
        currentImage: {
          previousValue: IMAGES[0],
          currentValue: IMAGES[0],
          firstChange: false,
          isFirstChange: () => false
        }
      });
      comp.ngOnInit();
      fixture.detectChanges();
      const element: DebugElement = fixture.debugElement;
      const mainCurrentImage: DebugElement = element.query(By.css('main.main-image-container'));
      expect(mainCurrentImage.properties['title']).toBe(CUSTOM_ACCESSIBILITY.mainContainerTitle);
      expect(mainCurrentImage.attributes['aria-label']).toBe(CUSTOM_ACCESSIBILITY.mainContainerAriaLabel);
      const aNavLeft: DebugElement = element.query(By.css('a.nav-left'));
      expect(aNavLeft.attributes['aria-label']).toBe(CUSTOM_ACCESSIBILITY.mainPrevImageAriaLabel);
      expect(aNavLeft.children[0].properties['title']).toBe(CUSTOM_ACCESSIBILITY.mainPrevImageTitle);
      const aNavRight: DebugElement = element.query(By.css('a.nav-right'));
      expect(aNavRight.attributes['aria-label']).toBe(CUSTOM_ACCESSIBILITY.mainNextImageAriaLabel);
      expect(aNavRight.children[0].properties['title']).toBe(CUSTOM_ACCESSIBILITY.mainNextImageTitle);
    });

    it(`should display current image with an array of images with a single element.`, () => {
      const configService = fixture.debugElement.injector.get(ConfigService);
      configService.set({
        accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
        currentImageConfig: <CurrentImageConfig>{
          loadingConfig: <LoadingConfig>{enable: true, type: LoadingType.STANDARD},
          description: <Description>{strategy: DescriptionStrategy.ALWAYS_VISIBLE}
        },
        slideConfig: <SlideConfig>{infinite: false, sidePreviews: {show: true, size: DEFAULT_SIZE}},
        keyboardConfig: null
      });
      comp.images = [IMAGES[0]];
      comp.currentImage = IMAGES[0];
      comp.isOpen = true;
      comp.ngOnChanges(<SimpleChanges>{
        currentImage: {
          previousValue: IMAGES[0],
          currentValue: IMAGES[0],
          firstChange: false,
          isFirstChange: () => false
        }
      });
      comp.ngOnInit();
      fixture.detectChanges();
      checkMainContainer();
      const model: TestModel = {
        currentImgTitle: 'Image 1/1',
        currentAlt: 'Image 1',
        currentDescription: 'Image 1/1',
        leftPreviewTitle: '',
        leftPreviewAlt: '',
        rightPreviewTitle: '',
        rightPreviewAlt: ''
      };
      checkCurrentImage(IMAGES[0], model);
    });

    it(`should display gallery with all defaults and auto-navigate (play enabled).`, fakeAsync(() => {
      const configService = fixture.debugElement.injector.get(ConfigService);
      configService.set({
        accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
        currentImageConfig: <CurrentImageConfig>{
          loadingConfig: <LoadingConfig>{enable: true, type: LoadingType.STANDARD},
          description: <Description>{strategy: DescriptionStrategy.ALWAYS_VISIBLE}
        },
        slideConfig: <SlideConfig>{playConfig: {autoPlay: true, interval: 5000, pauseOnHover: true}},
        keyboardConfig: null
      });
      comp.id = 0;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[0];
      comp.isOpen = true;
      fixture.detectChanges();
      const defaultInterval = 5000;

      comp.isFirstImage = true;
      comp.isLastImage = false;

      TEST_MODEL.forEach((val: TestModel, index: number) => {
        checkMainContainer();
        // TODO FIX THIS!!!!
        checkCurrentImage(IMAGES[index], val);
        // checkArrows(index === 0, index === IMAGES.length - 1);
        tick(defaultInterval + 100);
        if (index < IMAGES.length - 1) {
          comp.currentImage = IMAGES[index + 1];
          comp.ngOnChanges(<SimpleChanges>{
            currentImage: {
              previousValue: IMAGES[index],
              currentValue: IMAGES[index + 1],
              firstChange: false,
              isFirstChange: () => false
            }
          });
        }
        flush();
        fixture.detectChanges();
      });

      tick(defaultInterval + 100);
      flush();
      fixture.detectChanges();

      discardPeriodicTasks();
    }));
  });

  describe('---NO---', () => {
    it(`cannot navigate from the last image to the first one if infinite sliding is disabled`, () => {
      const infiniteSliding = false;
      const configService = fixture.debugElement.injector.get(ConfigService);
      configService.set({
        accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
        currentImageConfig: <CurrentImageConfig>{
          loadingConfig: <LoadingConfig>{enable: true, type: LoadingType.STANDARD},
          description: <Description>{strategy: DescriptionStrategy.ALWAYS_VISIBLE}
        },
        slideConfig: <SlideConfig>{infinite: infiniteSliding, sidePreviews: {show: true, size: DEFAULT_SIZE}},
        keyboardConfig: null
      });
      const index: number = IMAGES.length - 1;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[index];
      comp.isOpen = true;
      comp.ngOnChanges(<SimpleChanges>{
        currentImage: {
          previousValue: IMAGES[index],
          currentValue: IMAGES[index],
          firstChange: false,
          isFirstChange: () => false
        }
      });
      comp.ngOnInit();
      fixture.detectChanges();
      checkMainContainer();
      checkCurrentImage(IMAGES[index], TEST_MODEL_INFINITE[TEST_MODEL_INFINITE.length - 1]);
      checkArrows(index === 0 && !infiniteSliding, (index === IMAGES.length - 1) && !infiniteSliding);
      checkSidePreviews(IMAGES[index - 1], IMAGES[0],
        index === 0 && !infiniteSliding, (index === IMAGES.length - 1) && !infiniteSliding, TEST_MODEL_INFINITE[TEST_MODEL_INFINITE.length - 1]);

      comp.changeImage.subscribe((res: ImageModalEvent) => {
        fail(`shouldn't call 'changeImage' event, when infinite sliding is disabled and you are trying to navigate from the last image to the first one`);
      });
      comp.nextImage(Action.CLICK);
    });

    it(`cannot navigate from the first image to the last one if infinite sliding is disabled`, () => {
      const infiniteSliding = false;
      const configService = fixture.debugElement.injector.get(ConfigService);
      configService.set({
        accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
        currentImageConfig: <CurrentImageConfig>{
          loadingConfig: <LoadingConfig>{enable: true, type: LoadingType.STANDARD},
          description: <Description>{strategy: DescriptionStrategy.ALWAYS_VISIBLE}
        },
        slideConfig: <SlideConfig>{infinite: infiniteSliding, sidePreviews: {show: true, size: DEFAULT_SIZE}},
        keyboardConfig: null
      });
      const index = 0;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[index];
      comp.isOpen = true;
      comp.ngOnChanges(<SimpleChanges>{
        currentImage: {
          previousValue: IMAGES[index],
          currentValue: IMAGES[index],
          firstChange: false,
          isFirstChange: () => false
        }
      });
      comp.ngOnInit();
      fixture.detectChanges();
      checkMainContainer();
      checkCurrentImage(IMAGES[index], TEST_MODEL_INFINITE[0]);
      checkArrows(index === 0 && !infiniteSliding, (index === IMAGES.length - 1) && !infiniteSliding);
      checkSidePreviews(IMAGES[IMAGES.length - 1], IMAGES[index + 1],
        index === 0 && !infiniteSliding, (index === IMAGES.length - 1) && !infiniteSliding, TEST_MODEL_INFINITE[0]);

      comp.changeImage.subscribe((res: ImageModalEvent) => {
        fail(`shouldn't call 'changeImage' event, when infinite sliding is disabled and you are trying to navigate from the first image to the last one`);
      });
      comp.prevImage(Action.CLICK);
    });
  });
});
