/*
 The MIT License (MIT)

 Copyright (C) 2017-2021 Stefano Cappa (Ks89)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

import 'hammerjs';
import 'mousetrap';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { AccessibilityConfig } from '../../model/accessibility.interface';
import { KS_DEFAULT_ACCESSIBILITY_CONFIG } from '../../components/accessibility-default';
import { InternalLibImage } from '../../model/image-internal.class';
import { ModalGalleryComponent } from './modal-gallery.component';
import { Size } from '../../model/size.interface';
import { SizeDirective } from '../../directives/size.directive';
import { WrapDirective } from '../../directives/wrap.directive';
import { DirectionDirective } from '../../directives/direction.directive';
import { ATagBgImageDirective } from '../../directives/a-tag-bg-image.directive';
import { ConfigService } from '../../services/config.service';
import { ModalGalleryService } from './modal-gallery.service';
import { IdValidatorService } from '../../services/id-validator.service';
import { KeyboardService } from '../../services/keyboard.service';
import { ModalGalleryConfig } from '../../model/modal-gallery-config.interface';
import { DIALOG_DATA } from './modal-gallery.tokens';
import { OverlayModule } from '@angular/cdk/overlay';
import { LibConfig } from '../../model/lib-config.interface';
import { UpperButtonsComponent } from '../upper-buttons/upper-buttons.component';
import { CurrentImageComponent, ImageLoadEvent } from '../current-image/current-image.component';
import { DotsComponent } from '../dots/dots.component';
import { PreviewsComponent } from '../previews/previews.component';
import { FallbackImageDirective } from '../../directives/fallback-image.directive';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { LoadingSpinnerComponent } from '../current-image/loading-spinner/loading-spinner.component';
import { DescriptionDirective } from '../../directives/description.directive';
import { KeyboardNavigationDirective } from '../../directives/keyboard-navigation.directive';
import { By } from '@angular/platform-browser';
import { ButtonConfig, ButtonEvent, ButtonType } from '../../model/buttons-config.interface';
import { Action } from '../../model/action.enum';
import { ImageModalEvent } from '../../model/image.class';

let comp: ModalGalleryComponent;
let fixture: ComponentFixture<ModalGalleryComponent>;

const CUSTOM_ACCESSIBILITY: AccessibilityConfig = Object.assign({}, KS_DEFAULT_ACCESSIBILITY_CONFIG);
CUSTOM_ACCESSIBILITY.plainGalleryContentAriaLabel = 'custom plainGalleryContentAriaLabel';
CUSTOM_ACCESSIBILITY.plainGalleryContentTitle = 'custom plainGalleryContentTitle';

const DEFAULT_PLAIN_SIZE: Size = { width: 'auto', height: '50px' };
const CUSTOM_SIZE: Size = { height: '40px', width: '40px' };
const CUSTOM_SIZE_AUTO_HEIGHT: Size = { height: 'auto', width: '40px' };
const CUSTOM_SIZE_AUTO_WIDTH: Size = { height: '40px', width: 'auto' };
const CUSTOM_SIZES: Size[] = [CUSTOM_SIZE, CUSTOM_SIZE_AUTO_HEIGHT, CUSTOM_SIZE_AUTO_WIDTH];

const GALLERY_ID = 0;

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

class KeyboardServiceMock {
  init(config: LibConfig): Promise<void> {
    return new Promise(resolve => resolve());
  }

  // tslint:disable-next-line:no-any
  add(onBind: (e: KeyboardEvent, combo: string) => any, config: LibConfig): void {
  }

  reset(config: LibConfig): void {
  }
}

function initTestBed(): void {
  TestBed.configureTestingModule({
    imports: [OverlayModule],
    declarations: [ModalGalleryComponent,
      UpperButtonsComponent, CurrentImageComponent, DotsComponent, PreviewsComponent, LoadingSpinnerComponent,
      FallbackImageDirective, ClickOutsideDirective, DescriptionDirective, KeyboardNavigationDirective,
      SizeDirective, WrapDirective, DirectionDirective, ATagBgImageDirective]
  }).overrideComponent(ModalGalleryComponent, {
    set: {
      providers: [
        {
          provide: ConfigService,
          useClass: ConfigService
        },
        {
          provide: ModalGalleryService,
          useClass: ModalGalleryService
        },
        {
          provide: KeyboardService,
          useClass: KeyboardServiceMock
        },
        {
          provide: IdValidatorService,
          useClass: IdValidatorService
        },
        {
          provide: DIALOG_DATA,
          useValue: {
            id: GALLERY_ID,
            images: IMAGES,
            currentImage: IMAGES[0],
            libConfig: {
              accessibilityConfig: CUSTOM_ACCESSIBILITY
            } as LibConfig
          } as ModalGalleryConfig
        }
      ]
    }
  });
}

describe('ModalGalleryComponent', () => {
  beforeEach(() => {
    initTestBed();
    fixture = TestBed.createComponent(ModalGalleryComponent);
    comp = fixture.componentInstance;
  });

  it('should instantiate it', () => expect(comp).not.toBeNull());

  describe('---YES---', () => {

    it(`should display modal gallery`, () => {
      const modalGalleryService = fixture.debugElement.injector.get(ModalGalleryService);
      const configService = fixture.debugElement.injector.get(ConfigService);
      const keyboardService = fixture.debugElement.injector.get(KeyboardService);

      configService.setConfig(GALLERY_ID, { accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[0];
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;
      const modalGallery: DebugElement = element.query(By.css('div#modal-gallery-wrapper'));
      expect(modalGallery).not.toBeNull();

      console.log('modalGallery', modalGallery);
    });

    it(`should display modal gallery and call onCustomEmit`, () => {
      const modalGalleryService = fixture.debugElement.injector.get(ModalGalleryService);
      const configService = fixture.debugElement.injector.get(ConfigService);
      const keyboardService = fixture.debugElement.injector.get(KeyboardService);

      configService.setConfig(GALLERY_ID, { accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[0];
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;
      const modalGallery: DebugElement = element.query(By.css('div#modal-gallery-wrapper'));
      expect(modalGallery).not.toBeNull();

      const EVENT: ButtonEvent = {
        button: {
          type: ButtonType.CUSTOM
        } as ButtonConfig,
        image: IMAGES[0] as InternalLibImage,
        action: Action.NORMAL,
        galleryId: GALLERY_ID
      };
      comp.onCustomEmit(EVENT);
    });

    // it(`should display modal gallery and call onFullScreen`, () => {
    //   const modalGalleryService = fixture.debugElement.injector.get(ModalGalleryService);
    //   const configService = fixture.debugElement.injector.get(ConfigService);
    //   const keyboardService = fixture.debugElement.injector.get(KeyboardService);
    //
    //   configService.setConfig(GALLERY_ID, {accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG});
    //   comp.id = GALLERY_ID;
    //   comp.images = IMAGES;
    //   comp.currentImage = IMAGES[0];
    //   fixture.detectChanges();
    //
    //   const element: DebugElement = fixture.debugElement;
    //   const modalGallery: DebugElement = element.query(By.css('div#modal-gallery-wrapper'));
    //   expect(modalGallery).not.toBeNull();
    //
    //   const EVENT: ButtonEvent = {
    //     button: {
    //       type: ButtonType.FULLSCREEN
    //     } as ButtonConfig,
    //     image: IMAGES[0] as InternalLibImage,
    //     action: Action.NORMAL,
    //     galleryId: GALLERY_ID
    //   };
    //   comp.onFullScreen(EVENT);
    // });

    it(`should display modal gallery and call onDelete`, () => {
      const modalGalleryService = fixture.debugElement.injector.get(ModalGalleryService);
      const configService = fixture.debugElement.injector.get(ConfigService);
      const keyboardService = fixture.debugElement.injector.get(KeyboardService);

      configService.setConfig(GALLERY_ID, { accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[0];
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;
      const modalGallery: DebugElement = element.query(By.css('div#modal-gallery-wrapper'));
      expect(modalGallery).not.toBeNull();

      const EVENT: ButtonEvent = {
        button: {
          type: ButtonType.DELETE
        } as ButtonConfig,
        image: IMAGES[0] as InternalLibImage,
        action: Action.NORMAL,
        galleryId: GALLERY_ID
      };
      comp.onDelete(EVENT);
    });

    // it(`should display modal gallery and call onNavigate`, () => {
    //   const modalGalleryService = fixture.debugElement.injector.get(ModalGalleryService);
    //   const configService = fixture.debugElement.injector.get(ConfigService);
    //   const keyboardService = fixture.debugElement.injector.get(KeyboardService);
    //
    //   configService.setConfig(GALLERY_ID, {accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG});
    //   comp.id = GALLERY_ID;
    //   comp.images = IMAGES;
    //   comp.currentImage = IMAGES[0];
    //   fixture.detectChanges();
    //
    //   const element: DebugElement = fixture.debugElement;
    //   const modalGallery: DebugElement = element.query(By.css('div#modal-gallery-wrapper'));
    //   expect(modalGallery).not.toBeNull();
    //
    //   const EVENT: ButtonEvent = {
    //     button: {
    //       type: ButtonType.EXTURL
    //     } as ButtonConfig,
    //     image: IMAGES[0] as InternalLibImage,
    //     action: Action.NORMAL,
    //     galleryId: GALLERY_ID
    //   };
    //   comp.onNavigate(EVENT);
    // });

    it(`should display modal gallery and call onDownload`, () => {
      const modalGalleryService = fixture.debugElement.injector.get(ModalGalleryService);
      const configService = fixture.debugElement.injector.get(ConfigService);
      const keyboardService = fixture.debugElement.injector.get(KeyboardService);

      configService.setConfig(GALLERY_ID, { accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[0];
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;
      const modalGallery: DebugElement = element.query(By.css('div#modal-gallery-wrapper'));
      expect(modalGallery).not.toBeNull();

      const EVENT: ButtonEvent = {
        button: {
          type: ButtonType.DOWNLOAD
        } as ButtonConfig,
        image: IMAGES[0] as InternalLibImage,
        action: Action.NORMAL,
        galleryId: GALLERY_ID
      };
      comp.onDownload(EVENT);
    });

    it(`should display modal gallery and call onCloseGalleryButton`, () => {
      const modalGalleryService = fixture.debugElement.injector.get(ModalGalleryService);
      const configService = fixture.debugElement.injector.get(ConfigService);
      const keyboardService = fixture.debugElement.injector.get(KeyboardService);

      configService.setConfig(GALLERY_ID, { accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[0];
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;
      const modalGallery: DebugElement = element.query(By.css('div#modal-gallery-wrapper'));
      expect(modalGallery).not.toBeNull();

      const EVENT: ButtonEvent = {
        button: {
          type: ButtonType.CLOSE
        } as ButtonConfig,
        image: IMAGES[0] as InternalLibImage,
        action: Action.NORMAL,
        galleryId: GALLERY_ID
      };
      comp.onCloseGalleryButton(EVENT);
    });

    it(`should display modal gallery and call onCloseGallery`, () => {
      const modalGalleryService = fixture.debugElement.injector.get(ModalGalleryService);
      const configService = fixture.debugElement.injector.get(ConfigService);
      const keyboardService = fixture.debugElement.injector.get(KeyboardService);

      configService.setConfig(GALLERY_ID, { accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[0];
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;
      const modalGallery: DebugElement = element.query(By.css('div#modal-gallery-wrapper'));
      expect(modalGallery).not.toBeNull();

      const EVENT: ImageModalEvent = {
        action: Action.NORMAL,
        galleryId: GALLERY_ID,
        result: true
      };
      comp.onCloseGallery(EVENT);
    });

    it(`should display modal gallery and call closeGallery`, () => {
      const modalGalleryService = fixture.debugElement.injector.get(ModalGalleryService);
      const configService = fixture.debugElement.injector.get(ConfigService);
      const keyboardService = fixture.debugElement.injector.get(KeyboardService);

      configService.setConfig(GALLERY_ID, { accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[0];
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;
      const modalGallery: DebugElement = element.query(By.css('div#modal-gallery-wrapper'));
      expect(modalGallery).not.toBeNull();

      comp.closeGallery(Action.NORMAL, true, false);
    });

    it(`should display modal gallery and call onClickOutside`, () => {
      const modalGalleryService = fixture.debugElement.injector.get(ModalGalleryService);
      const configService = fixture.debugElement.injector.get(ConfigService);
      const keyboardService = fixture.debugElement.injector.get(KeyboardService);

      configService.setConfig(GALLERY_ID, { accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[0];
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;
      const modalGallery: DebugElement = element.query(By.css('div#modal-gallery-wrapper'));
      expect(modalGallery).not.toBeNull();

      comp.onClickOutside(true);
    });

    it(`should display modal gallery and call onImageLoad`, () => {
      const modalGalleryService = fixture.debugElement.injector.get(ModalGalleryService);
      const configService = fixture.debugElement.injector.get(ConfigService);
      const keyboardService = fixture.debugElement.injector.get(KeyboardService);

      configService.setConfig(GALLERY_ID, { accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[0];
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;
      const modalGallery: DebugElement = element.query(By.css('div#modal-gallery-wrapper'));
      expect(modalGallery).not.toBeNull();

      const EVENT: ImageLoadEvent = {
        status: true,
        index: 0,
        id: GALLERY_ID
      };

      comp.onImageLoad(EVENT);
    });

    it(`should display modal gallery and call onClickDot`, () => {
      const modalGalleryService = fixture.debugElement.injector.get(ModalGalleryService);
      const configService = fixture.debugElement.injector.get(ConfigService);
      const keyboardService = fixture.debugElement.injector.get(KeyboardService);

      configService.setConfig(GALLERY_ID, { accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[0];
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;
      const modalGallery: DebugElement = element.query(By.css('div#modal-gallery-wrapper'));
      expect(modalGallery).not.toBeNull();

      comp.onClickDot(1);
    });

    it(`should display modal gallery and call onClickPreview`, () => {
      const modalGalleryService = fixture.debugElement.injector.get(ModalGalleryService);
      const configService = fixture.debugElement.injector.get(ConfigService);
      const keyboardService = fixture.debugElement.injector.get(KeyboardService);

      configService.setConfig(GALLERY_ID, { accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[0];
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;
      const modalGallery: DebugElement = element.query(By.css('div#modal-gallery-wrapper'));
      expect(modalGallery).not.toBeNull();

      const EVENT: ImageModalEvent = {
        action: Action.NORMAL,
        galleryId: GALLERY_ID,
        result: 1
      };

      comp.onClickPreview(EVENT);
    });

    it(`should display modal gallery and updateImages via modalGalleryService`, () => {
      const modalGalleryService: ModalGalleryService = fixture.debugElement.injector.get(ModalGalleryService);
      const configService: ConfigService = fixture.debugElement.injector.get(ConfigService);
      const keyboardService: KeyboardService = fixture.debugElement.injector.get(KeyboardService);

      configService.setConfig(GALLERY_ID, { accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[0];
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;
      const modalGallery: DebugElement = element.query(By.css('div#modal-gallery-wrapper'));
      expect(modalGallery).not.toBeNull();

      // change IMAGES array pushing a new Image (equals to the first one)
      modalGalleryService.updateModalImages([...IMAGES, IMAGES[0]]);
    });
  });
});
