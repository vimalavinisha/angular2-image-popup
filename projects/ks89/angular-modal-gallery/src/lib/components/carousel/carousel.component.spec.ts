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

import 'hammerjs';
import 'mousetrap';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
import { DotsConfig } from '../../model/dots-config.interface';
import { CarouselConfig } from '../../model/carousel-config.interface';
import { PlayConfig } from '../../model/play-config.interface';
import { CarouselImageConfig } from '../../model/carousel-image-config.interface';
import { DescriptionStrategy } from '../../model/description.interface';
import { KS_DEFAULT_ACCESSIBILITY_CONFIG } from '../accessibility-default';
import { Size } from '../../model/size.interface';
import { CarouselPreviewConfig } from '../../model/carousel-preview-config.interface';

let comp: CarouselComponent;
let fixture: ComponentFixture<CarouselComponent>;

interface TestModel {
  currentImgTitle: string;
  currentAlt: string;
  currentDescription: string;
  leftPreviewTitle: string;
  leftPreviewAlt: string;
  rightPreviewTitle: string;
  rightPreviewAlt: string;
}

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

const ID_ERROR = 'You must provide a valid [id]="unique integer > 0 here" to the gallery/carousel in your template';

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
  // should navigate between images clicking on left side preview. Test i=0
  // should navigate between images to the right using swipe gestures. Test i=0
  // should navigate between images to the left using swipe gestures. Test i=0
  // should display current image, arrows and side previews with custom slideConfig. Test i=0, j=0
  // should display current image, arrows and side previews with infinite sliding. Test i=0, j=0
  // should display current image and arrows WITHOUT side previews. Test i=0, j=0
  // should display current image with custom accessibility
  // cannot navigate from the last image to the first one if infinite sliding is disabled

  describe('---YES---', () => {
    it(`should display carousel with all defaults.`, () => {
      comp.id = 0;
      comp.images = IMAGES;
      comp.ngOnInit();
      fixture.detectChanges();
    });

    it(`should display carousel no infinite.`, () => {
      comp.id = 0;
      comp.images = IMAGES;
      comp.infinite = false;
      comp.ngOnInit();
      fixture.detectChanges();
    });

    it(`should display carousel without dots.`, () => {
      comp.id = 0;
      comp.images = IMAGES;
      comp.dotsConfig = <DotsConfig>{visible: false};
      comp.ngOnInit();
      fixture.detectChanges();
    });

    it(`should display carousel without arrows.`, () => {
      comp.id = 0;
      comp.images = IMAGES;
      comp.carouselConfig = <CarouselConfig>{showArrows: false};
      comp.ngOnInit();
      fixture.detectChanges();
    });

    const PLAY_CONFIG: PlayConfig[] = [
      {autoPlay: true, interval: 5000, pauseOnHover: true},
      {autoPlay: true, interval: 1000, pauseOnHover: true},
      {autoPlay: true, interval: 10000, pauseOnHover: true},
      {autoPlay: true, interval: 1, pauseOnHover: true},
      {autoPlay: true, interval: 0, pauseOnHover: true},
      {autoPlay: true, interval: -1, pauseOnHover: true},
      {autoPlay: true, interval: -1000, pauseOnHover: true},

      {autoPlay: true, interval: 1000, pauseOnHover: false},

      {autoPlay: false, interval: 1000, pauseOnHover: true},
      {autoPlay: false, interval: 10000, pauseOnHover: false}
    ];

    it(`should display carousel without autoplay.`, () => {
      comp.id = 0;
      comp.images = IMAGES;
      comp.playConfig = <PlayConfig>{autoPlay: false};
      comp.ngOnInit();
      fixture.detectChanges();
    });

    const PREVIEW_CONFIGS: CarouselPreviewConfig[] = [
      {visible: true},
      {visible: true, clickable: true},
      {visible: true, clickable: false},
      {visible: true, number: 7},
      {visible: true, number: 0},
      {visible: true, number: -1},
      {visible: true, number: 4, width: 'auto', maxHeight: '100px'},
      {visible: true, number: 4, width: 'auto', maxHeight: '100px'},
      {visible: true, number: 4, width: '100px', maxHeight: '100px'},
    ];

    it(`should display carousel with custom previews.`, () => {
      comp.id = 0;
      comp.images = IMAGES;
      comp.previewConfig = <CarouselPreviewConfig>{number: 7, width: 'auto', maxHeight: '100px'};
      comp.ngOnInit();
      fixture.detectChanges();
    });

    it(`should display carousel with fixed width.`, () => {
      comp.id = 0;
      comp.images = IMAGES;
      comp.carouselConfig = <CarouselConfig>{maxWidth: '766px'};
      comp.previewConfig = <CarouselPreviewConfig>{number: 5, width: 'auto', maxHeight: '100px'};
      comp.ngOnInit();
      fixture.detectChanges();
    });

    const DESC_STRATEGIES: DescriptionStrategy[] = [
      DescriptionStrategy.ALWAYS_VISIBLE,
      DescriptionStrategy.ALWAYS_HIDDEN,
      DescriptionStrategy.HIDE_IF_EMPTY
    ];

    // try different Description strategy
    it(`should display carousel with description.`, () => {
      comp.id = 0;
      comp.images = IMAGES;
      comp.carouselImageConfig = <CarouselImageConfig>{description: {strategy: DescriptionStrategy.ALWAYS_VISIBLE}};
      comp.ngOnInit();
      fixture.detectChanges();
    });

    const PREVIEW_CONFIGS_BREAKPOINT: CarouselPreviewConfig[] = [
      {visible: true, breakpoints: {xSmall: 50, small: 60, medium: 80, large: 150, xLarge: 180}},
      {visible: true, breakpoints: {xSmall: 100, small: 120, medium: 150, large: 200, xLarge: 220}},
      {visible: true, breakpoints: {xSmall: 200, small: 220, medium: 10, large: 50, xLarge: 100}},

      {visible: true, breakpoints: {xSmall: 0, small: 0, medium: 0, large: 0, xLarge: 0}},
      {visible: true, breakpoints: {xSmall: -1, small: -2, medium: -10, large: -10, xLarge: -1}},
    ];


    it(`should display carousel with custom breakpoints.`, () => {
      comp.id = 0;
      comp.images = IMAGES;
      comp.previewConfig = <CarouselPreviewConfig>{visible: true, breakpoints: {xSmall: 50, small: 60, medium: 80, large: 150, xLarge: 180}};
      comp.ngOnInit();
      fixture.detectChanges();
    });

    it(`should display carousel with custom accessibility.`, () => {
      comp.id = 0;
      comp.images = IMAGES;
      comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
      comp.ngOnInit();
      fixture.detectChanges();
    });
  });

  // describe('---ERRORS---', () => {
  //   it(`should throw errors, because id is not valid.`, () => {
  //     comp.id = -1;
  //     comp.images = IMAGES;
  //     comp.ngOnInit();
  //     expect(() => fixture.detectChanges()).toThrow(ID_ERROR);
  //   });
  // });
});
