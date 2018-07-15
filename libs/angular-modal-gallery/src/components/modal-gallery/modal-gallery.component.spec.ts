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
import { DebugElement, SimpleChanges } from '@angular/core';
import { By } from '@angular/platform-browser';
import { InternalLibImage } from '../../model/image-internal.class';
import { ModalGalleryComponent } from './modal-gallery.component';
import { BackgroundComponent } from '../background/background.component';
import { CurrentImageComponent, ImageLoadEvent } from '../current-image/current-image.component';
import { LoadingSpinnerComponent } from '../current-image/loading-spinner/loading-spinner.component';
import { PreviewsComponent } from '../previews/previews.component';
import { InternalButtonConfig, UpperButtonsComponent } from '../upper-buttons/upper-buttons.component';
import { DotsComponent } from '../dots/dots.component';
import { PlainGalleryComponent } from '../plain-gallery/plain-gallery.component';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { SizeDirective } from '../../directives/size.directive';
import { KeyboardNavigationDirective } from '../../directives/keyboard-navigation.directive';
import { ATagBgImageDirective } from '../../directives/a-tag-bg-image.directive';
import { WrapDirective } from '../../directives/wrap.directive';
import { DirectionDirective } from '../../directives/direction.directive';
import { KEYBOARD_CONFIGURATION, KeyboardService } from '../../services/keyboard.service';
import { KeyboardServiceConfig } from '../../model/keyboard-service-config.interface';
import { Action } from '../../model/action.enum';
import { ButtonEvent, ButtonType } from '../../model/buttons-config.interface';
import { ImageModalEvent } from '../../model/image.class';
import { AdvancedLayout, LineLayout, PlainGalleryConfig, PlainGalleryStrategy } from '../../model/plain-gallery-config.interface';
import { getIndex } from '../../utils/image.util';
import { DescriptionDirective } from '../../directives/description.directive';
import { GalleryService } from '../../services/gallery.service';

let comp: ModalGalleryComponent;
let fixture: ComponentFixture<ModalGalleryComponent>;

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

function getSimpleChangesMock(): SimpleChanges {
  return <SimpleChanges>{
    modalImages: {
      previousValue: IMAGES,
      currentValue: IMAGES,
      firstChange: false,
      isFirstChange: () => false
    }
  };
}

function initTestBed() {
  return TestBed.configureTestingModule({
    declarations: [ModalGalleryComponent, ClickOutsideDirective, BackgroundComponent,
      UpperButtonsComponent, CurrentImageComponent, LoadingSpinnerComponent,
      DotsComponent, PlainGalleryComponent, PreviewsComponent,
      SizeDirective, KeyboardNavigationDirective, ATagBgImageDirective,
      WrapDirective, DirectionDirective, DescriptionDirective]
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
        }
      ]
    }
  });
}

describe('ModalGalleryComponent', () => {
  beforeEach(async(() => {
    return initTestBed();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGalleryComponent);
    comp = fixture.componentInstance;
  });

  it('should instantiate it', () => expect(comp).not.toBeNull());

  describe('---YES---', () => {

    it(`should display plain gallery, but not modal gallery`, () => {
      comp.id = 0;
      comp.modalImages = IMAGES;
      comp.currentImage = IMAGES[0];
      comp.ngOnChanges(getSimpleChangesMock());
      comp.ngOnInit();
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;
      const modalGallery: DebugElement = element.query(By.css('div#modal-gallery-wrapper'));
      expect(modalGallery).toBeNull();
      const plainGallery: DebugElement = element.query(By.css('div.plain-container'));
      expect(plainGallery).not.toBeNull();
    });

    it(`should display modal gallery`, () => {
      comp.id = 0;
      comp.modalImages = IMAGES;
      comp.currentImage = IMAGES[0];
      comp.ngOnChanges(getSimpleChangesMock());

      comp.hasData.subscribe(val => {
        expect(val).toBeTruthy();
      });

      comp.ngOnInit();
      const element: DebugElement = fixture.debugElement;

      comp.show.subscribe(val => {
        fixture.detectChanges();
        const modalGallery: DebugElement = element.query(By.css('div#modal-gallery-wrapper'));
        expect(modalGallery).not.toBeNull();
      });

      comp.onShowModalGallery(0);
    });

    it(`should call onCustomEmit and subscribe to its events`, () => {
      const mockButtonEvent: ButtonEvent = {
        button: <InternalButtonConfig>{type: ButtonType.CUSTOM, id: 1},
        image: null,
        action: Action.CLICK
      };
      const currentImage: InternalLibImage = IMAGES[0];
      comp.id = 0;
      comp.modalImages = IMAGES;
      comp.currentImage = currentImage;
      comp.ngOnChanges(getSimpleChangesMock());

      comp.hasData.subscribe(val => {
        expect(val).toBeTruthy();
      });

      comp.ngOnInit();

      comp.buttonBeforeHook.subscribe((event: ButtonEvent) => {
        expect(event.button).toEqual(mockButtonEvent.button);
        expect(event.image).toEqual(currentImage);
        expect(event.action).toEqual(mockButtonEvent.action);

      });

      comp.buttonAfterHook.subscribe((event: ButtonEvent) => {
        expect(event.button).toEqual(mockButtonEvent.button);
        expect(event.image).toEqual(currentImage);
        expect(event.action).toEqual(mockButtonEvent.action);
      });

      comp.onCustomEmit(mockButtonEvent);
    });

    // it(`should call onRefresh and subscribe to its events`, () => {
    //   const mockButtonEvent: ButtonEvent = {
    //     button: <InternalButtonConfig>{type: ButtonType.REFRESH, id: 1},
    //     image: null,
    //     action: Action.CLICK
    //   };
    //   const currentImage: InternalLibImage = IMAGES[0];
    //   comp.modalImages = IMAGES;
    //   comp.currentImage = currentImage;
    //   comp.ngOnChanges(getSimpleChangesMock());
    //
    //   comp.hasData.subscribe(val => {
    //     expect(val).toBeTruthy();
    //   });
    //
    //   comp.ngOnInit();
    //
    //   comp.buttonBeforeHook.subscribe((event: ButtonEvent) => {
    //     expect(event.button).toEqual(mockButtonEvent.button);
    //     expect(event.image).toEqual(currentImage);
    //     expect(event.action).toEqual(mockButtonEvent.action);
    //
    //   });
    //
    //   comp.buttonAfterHook.subscribe((event: ButtonEvent) => {
    //     expect(event.button).toEqual(mockButtonEvent.button);
    //     expect(event.image).toEqual(currentImage);
    //     expect(event.action).toEqual(mockButtonEvent.action);
    //
    //     expect(comp.currentImage.previouslyLoaded).toBeDefined();
    //     expect(comp.currentImage.previouslyLoaded).toBeFalsy();
    //   });
    //
    //   comp.onRefresh(mockButtonEvent);
    // });

    it(`should call onDelete (first image) and subscribe to its events`, () => {
      const mockButtonEvent: ButtonEvent = {
        button: <InternalButtonConfig>{type: ButtonType.DELETE, id: 1},
        image: null,
        action: Action.CLICK
      };

      // mock current-image component
      comp.currentImageComponent = {
        getIndexToDelete: () => 0,
        nextImage: () => {
          comp.onChangeCurrentImage(new ImageModalEvent(Action.CLICK, getIndex(IMAGES[1], IMAGES)));
        },
        prevImage: () => {
          comp.onChangeCurrentImage(new ImageModalEvent(Action.CLICK, getIndex(IMAGES[0], IMAGES)));
        }
      };

      const currentImage: InternalLibImage = IMAGES[0];
      comp.id = 0;
      comp.modalImages = IMAGES;
      comp.currentImage = currentImage;
      comp.ngOnChanges(getSimpleChangesMock());

      comp.hasData.subscribe(val => {
        expect(val).toBeTruthy();
      });

      comp.ngOnInit();

      comp.buttonBeforeHook.subscribe((event: ButtonEvent) => {
        expect(event.button).toEqual(mockButtonEvent.button);
        expect(event.image).toEqual(currentImage);
        expect(event.action).toEqual(mockButtonEvent.action);

      });

      comp.show.subscribe((val: ImageModalEvent) => {
        expect(val).toEqual(new ImageModalEvent(Action.CLICK, (0) + 1 + 1));
      });

      comp.buttonAfterHook.subscribe((event: ButtonEvent) => {
        expect(event.button).toEqual(mockButtonEvent.button);
        expect(event.image).toEqual(currentImage);
        expect(event.action).toEqual(mockButtonEvent.action);
      });

      comp.onDelete(mockButtonEvent);
    });

    it(`should call onDelete (last image) and subscribe to its events`, () => {
      const mockButtonEvent: ButtonEvent = {
        button: <InternalButtonConfig>{type: ButtonType.DELETE, id: 2},
        image: null,
        action: Action.CLICK
      };

      // mock current-image component
      comp.currentImageComponent = {
        getIndexToDelete: () => IMAGES.length - 1,
        nextImage: () => {
          comp.onChangeCurrentImage(new ImageModalEvent(Action.CLICK, getIndex(IMAGES[IMAGES.length - 1], IMAGES)));
        },
        prevImage: () => {
          comp.onChangeCurrentImage(new ImageModalEvent(Action.CLICK, getIndex(IMAGES[IMAGES.length - 2], IMAGES)));
        }
      };

      const currentImage: InternalLibImage = IMAGES[IMAGES.length - 1];
      comp.id = 0;
      comp.modalImages = IMAGES;
      comp.currentImage = currentImage;
      comp.ngOnChanges(getSimpleChangesMock());

      comp.hasData.subscribe(val => {
        expect(val).toBeTruthy();
      });

      comp.ngOnInit();

      comp.buttonBeforeHook.subscribe((event: ButtonEvent) => {
        expect(event.button).toEqual(mockButtonEvent.button);
        expect(event.image).toEqual(currentImage);
        expect(event.action).toEqual(mockButtonEvent.action);

      });

      comp.show.subscribe((val: ImageModalEvent) => {
        expect(val).toEqual(new ImageModalEvent(Action.CLICK, (IMAGES.length - 1) + 1 - 1));
      });

      comp.buttonAfterHook.subscribe((event: ButtonEvent) => {
        expect(event.button).toEqual(mockButtonEvent.button);
        expect(event.image).toEqual(currentImage);
        expect(event.action).toEqual(mockButtonEvent.action);
      });

      comp.onDelete(mockButtonEvent);
    });

    it(`should call onDelete (with only an image) and close modal gallery automatically`, () => {
      const mockButtonEvent: ButtonEvent = {
        button: <InternalButtonConfig>{type: ButtonType.DELETE, id: 1},
        image: null,
        action: Action.CLICK
      };

      // mock current-image component
      comp.currentImageComponent = {
        getIndexToDelete: () => 0,
        nextImage: () => {
          comp.onChangeCurrentImage(new ImageModalEvent(Action.CLICK, 0));
        },
        prevImage: () => {
          comp.onChangeCurrentImage(new ImageModalEvent(Action.CLICK, 0));
        }
      };

      const currentImage: InternalLibImage = IMAGES[0];
      comp.id = 0;
      comp.modalImages = IMAGES.slice(0, 1); // only one image
      comp.currentImage = currentImage;
      comp.ngOnChanges(getSimpleChangesMock());

      comp.hasData.subscribe(val => {
        expect(val).toBeTruthy();
      });

      comp.ngOnInit();

      comp.buttonBeforeHook.subscribe((event: ButtonEvent) => {
        expect(event.button).toEqual(mockButtonEvent.button);
        expect(event.image).toEqual(currentImage);
        expect(event.action).toEqual(mockButtonEvent.action);

      });

      comp.close.subscribe((val: ImageModalEvent) => {
        expect(val).toEqual(new ImageModalEvent(Action.NORMAL, true));
      });

      comp.buttonAfterHook.subscribe((event: ButtonEvent) => {
        expect(event.button).toEqual(mockButtonEvent.button);
        expect(event.image).toEqual(currentImage);
        expect(event.action).toEqual(mockButtonEvent.action);
      });

      comp.onDelete(mockButtonEvent);
    });

    // it(`should call onDownload and subscribe to its events`, () => {
    //   const mockButtonEvent: ButtonEvent = {
    //     button: <InternalButtonConfig>{type: ButtonType.DOWNLOAD, id: 3},
    //     image: null,
    //     action: Action.CLICK
    //   };
    //   const currentImage: InternalLibImage = IMAGES[0];
    //   comp.modalImages = IMAGES;
    //   comp.currentImage = currentImage;
    //   comp.downloadable = true; // images are now downloadable
    //
    //   comp.ngOnChanges(getSimpleChangesMock());
    //
    //   comp.hasData.subscribe(val => {
    //     expect(val).toBeTruthy();
    //   });
    //
    //   comp.ngOnInit();
    //
    //   comp.buttonBeforeHook.subscribe((event: ButtonEvent) => {
    //     expect(event.button).toEqual(mockButtonEvent.button);
    //     expect(event.image).toEqual(currentImage);
    //     expect(event.action).toEqual(mockButtonEvent.action);
    //   });
    //
    //   comp.buttonAfterHook.subscribe((event: ButtonEvent) => {
    //     expect(event.button).toEqual(mockButtonEvent.button);
    //     expect(event.image).toEqual(currentImage);
    //     expect(event.action).toEqual(mockButtonEvent.action);
    //   });
    //
    //   comp.onDownload(mockButtonEvent);
    // });

    // it(`should call onNavigate and subscribe to its events`, () => {
    //   const mockButtonEvent: ButtonEvent = {
    //     button: <InternalButtonConfig>{type: ButtonType.EXTURL, id: 4},
    //     image: null,
    //     action: Action.CLICK
    //   };
    //   const currentImage: InternalLibImage = IMAGES[0];
    //   comp.modalImages = IMAGES;
    //   comp.currentImage = currentImage;
    //
    //   // const windowLocationSpy = spyOn(window, 'location').and.returnValue({location: {href: ''}});
    //   const windowLocationHrefSpy = spyOn(window.location, 'href').and.returnValue({href: ''});
    //   comp.ngOnChanges(getSimpleChangesMock());
    //
    //   comp.hasData.subscribe(val => {
    //     expect(val).toBeTruthy();
    //   });
    //
    //   comp.ngOnInit();
    //
    //   comp.buttonBeforeHook.subscribe((event: ButtonEvent) => {
    //     expect(event.button).toEqual(mockButtonEvent.button);
    //     expect(event.image).toEqual(currentImage);
    //     expect(event.action).toEqual(mockButtonEvent.action);
    //   });
    //
    //   comp.buttonAfterHook.subscribe((event: ButtonEvent) => {
    //     expect(event.button).toEqual(mockButtonEvent.button);
    //     expect(event.image).toEqual(currentImage);
    //     expect(event.action).toEqual(mockButtonEvent.action);
    //   });
    //
    //   comp.onNavigate(mockButtonEvent);
    // });

    it(`should call onClose and subscribe to its events`, () => {
      const mockButtonEvent: ButtonEvent = {
        button: <InternalButtonConfig>{type: ButtonType.CLOSE, id: 5},
        image: null,
        action: Action.CLICK
      };
      const currentImage: InternalLibImage = IMAGES[0];
      comp.id = 0;
      comp.modalImages = IMAGES;
      comp.currentImage = currentImage;

      comp.ngOnChanges(getSimpleChangesMock());

      comp.hasData.subscribe(val => {
        expect(val).toBeTruthy();
      });

      comp.close.subscribe(val => {
        expect(val.action).toBe(Action.NORMAL);
        expect(val.result).toBeTruthy();
      });

      comp.ngOnInit();

      comp.buttonBeforeHook.subscribe((event: ButtonEvent) => {
        expect(event.button).toEqual(mockButtonEvent.button);
        expect(event.image).toEqual(currentImage);
        expect(event.action).toEqual(mockButtonEvent.action);
      });

      comp.buttonAfterHook.subscribe((event: ButtonEvent) => {
        expect(event.button).toEqual(mockButtonEvent.button);
        expect(event.image).toEqual(currentImage);
        expect(event.action).toEqual(mockButtonEvent.action);
      });

      comp.onCloseGallery(mockButtonEvent);
    });

    it(`should call closeGallery (emulating galleryService) and subscribe to its events`, () => {
      const currentImage: InternalLibImage = IMAGES[0];
      comp.id = 0;
      comp.modalImages = IMAGES;
      comp.currentImage = currentImage;

      comp.ngOnChanges(getSimpleChangesMock());

      comp.hasData.subscribe(val => {
        expect(val).toBeTruthy();
      });

      comp.close.subscribe(val => {
        expect(val.action).toBe(Action.NORMAL);
        expect(val.result).toBeTruthy();
      });

      comp.ngOnInit();

      comp.closeGallery(Action.NORMAL, true);
    });

    it(`should trigger galleryService's events and subscribe to its events in modal-gallery.component`, () => {
      const currentImage: InternalLibImage = IMAGES[0];
      comp.id = 0;
      comp.modalImages = IMAGES;
      comp.currentImage = currentImage;

      comp.ngOnChanges(getSimpleChangesMock());
      comp.ngOnInit();

      comp.show.subscribe((val: ImageModalEvent) => {
        expect(val.result).toBe(1);
        expect(val.action).toBe(Action.LOAD);
      });

      comp.close.subscribe((val: ImageModalEvent) => {
        expect(val.action).toBe(0);
        expect(val.result).toBeTruthy();
      });

      const galleryService = fixture.debugElement.injector.get(GalleryService);
      galleryService.closeGallery(0);
      galleryService.openGallery(0, 0);
    });

    it(`shouldn't trigger 'show' event, because galleryService's openGallery has a an index out of range as input`, () => {
      const outOfRangeIndex: number = IMAGES.length + 10; // out of range
      const currentImage: InternalLibImage = IMAGES[0];
      comp.id = 0;
      comp.modalImages = IMAGES;
      comp.currentImage = currentImage;

      comp.ngOnChanges(getSimpleChangesMock());
      comp.ngOnInit();

      comp.show.subscribe(() => fail(`Shouldn't get show event, because index is out of range`));

      const galleryService = fixture.debugElement.injector.get(GalleryService);
      galleryService.openGallery(0, outOfRangeIndex);
    });

    it(`shouldn't trigger galleryService's events because galleryId is different`, () => {
      const differentGalleryId = 1;
      const currentImage: InternalLibImage = IMAGES[0];
      comp.id = 0;
      comp.modalImages = IMAGES;
      comp.currentImage = currentImage;

      comp.ngOnChanges(getSimpleChangesMock());
      comp.ngOnInit();

      comp.show.subscribe(() => fail(`Shouldn't get show event, because galleryId is different`));
      comp.close.subscribe(() => fail(`Shouldn't get close event, because galleryId is different`));

      const galleryService = fixture.debugElement.injector.get(GalleryService);
      galleryService.closeGallery(differentGalleryId);
      galleryService.openGallery(differentGalleryId, 0);
    });

    it(`should call closeOutside and subscribe to its events`, () => {
      const currentImage: InternalLibImage = IMAGES[0];
      comp.id = 0;
      comp.modalImages = IMAGES;
      comp.currentImage = currentImage;
      comp.enableCloseOutside = true;
      comp.ngOnChanges(getSimpleChangesMock());
      comp.ngOnInit();
      comp.close.subscribe((event: ImageModalEvent) => {
        expect(event.result).toBeTruthy();
        expect(event.action).toBe(Action.CLICK);
      });
      comp.onClickOutside(true);
    });

    it(`should call onClickDot to change the current image`, () => {
      const currentImage: InternalLibImage = IMAGES[0];
      comp.id = 0;
      comp.modalImages = IMAGES;
      comp.currentImage = currentImage;
      comp.ngOnChanges(getSimpleChangesMock());
      comp.ngOnInit();
      comp.onClickDot(2);
      expect(comp.currentImage.id).toBe(2);
    });

    it(`should call onClickPreview to change the current image`, () => {
      const currentImage: InternalLibImage = IMAGES[0];
      comp.id = 0;
      comp.modalImages = IMAGES;
      comp.currentImage = currentImage;
      comp.ngOnChanges(getSimpleChangesMock());
      comp.ngOnInit();
      comp.onClickPreview(IMAGES[1]);
      expect(comp.currentImage.id).toBe(IMAGES[1].id);
    });

    it(`should call onImageLoad`, () => {
      const currentImage: InternalLibImage = IMAGES[0];
      comp.id = 0;
      comp.modalImages = IMAGES;
      comp.currentImage = currentImage;
      comp.ngOnChanges(getSimpleChangesMock());
      comp.ngOnInit();
      comp.onImageLoad(<ImageLoadEvent>{status: true, index: 0, id: currentImage.id});
      expect(comp.images[0].id).toBe(currentImage.id);
      expect(comp.images[0].previouslyLoaded).toBeTruthy();
    });

    [
      null,
      {layout: null},
      {
        strategy: PlainGalleryStrategy.ROW,
        layout: new LineLayout({width: '100px', height: '100px'}, {length: 2, wrap: false}, 'flex-start')
      }
    ].forEach((val: any, index: number) => {
      it(`should expect isPlainGalleryVisible to be true`, () => {
        comp.plainGalleryConfig = val;
        expect(comp.isPlainGalleryVisible).toBeTruthy();
      });
    });

    it(`should call ngOnChanges with different inputs, to re-init images`, () => {
      const currentImage: InternalLibImage = IMAGES[0];
      comp.id = 0;
      comp.modalImages = IMAGES;
      comp.currentImage = currentImage;

      comp.hasData.subscribe((val: ImageModalEvent) => {
        expect(val.action).toBe(Action.LOAD);
        expect(val.result).toBe(true);
      });

      comp.ngOnChanges(<SimpleChanges>{
        modalImages: {
          previousValue: IMAGES,
          // random value, the important thing is previousValue !== currentValue
          currentValue: IMAGES.slice(0, 3),
          firstChange: false,
          isFirstChange: () => false
        }
      });
    });

    it(`should call ngOnChanges with advancedPlainLayout to open modal gallery`, () => {
      const currentImage: InternalLibImage = IMAGES[0];
      comp.id = 0;
      comp.modalImages = IMAGES;
      comp.currentImage = currentImage;

      comp.show.subscribe((val: ImageModalEvent) => {
        expect(val.action).toBe(Action.LOAD);
        expect(val.result).toBe(1);
      });

      comp.ngOnInit();

      comp.ngOnChanges(<SimpleChanges>{
        plainGalleryConfig: {
          currentValue: <PlainGalleryConfig>{strategy: PlainGalleryStrategy.CUSTOM, layout: new AdvancedLayout(0, true)},
          previousValue: null, // not important for this test
          firstChange: false, // not important for this test
          isFirstChange: () => false // not important for this test
        }
      });
    });


    const mockGalleryServiceInputs: any = [
      {id: 0, index: 0},
      {id: 1, index: 1},
      {id: 100, index: 2},
      {id: 2000, index: 3}
    ];

    mockGalleryServiceInputs.forEach((val: any, index: number) => {
      it(`should listen for gallery service's navigate events. Test i=${index}`, () => {
        comp.modalImages = IMAGES;
        comp.id = 0;
        comp.id = val.id;
        comp.show.subscribe((result: ImageModalEvent) => {
          // console.log('***-------------------------------------', result);
          expect(result.action).toBe(Action.LOAD);
          expect(result.result).toBe(val.index + 1);
        });

        const galleryService: GalleryService = fixture.debugElement.injector.get(GalleryService);
        galleryService.openGallery(val.id, val.index);
      });
    });

  });

  describe('------NO------', () => {

    it(`shouldn't display the gallery, because id is a mandatory parameter`, () => {
      comp.id = undefined;
      comp.modalImages = IMAGES;
      comp.currentImage = IMAGES[0];

      const error = new Error(`'[id]="a number >= 0"' is a mandatory input from 6.0.0 in angular-modal-gallery.` +
        `If you are using multiple instances of this library, please be sure to use different ids`);

      expect(() => comp.ngOnInit()).toThrow(error);
    });

    [{id: 1, index: IMAGES.length + 5}, {id: 1, index: IMAGES.length + 100}].forEach((val: any, index: number) => {
      it(`shouldn't listen for gallery service's navigate events if index is greater then length. Test i=${index}`, () => {
        comp.modalImages = IMAGES;
        comp.id = val.id;
        comp.show.subscribe(() => {
          fail(`Shouldn't call this, because input params are not valid`);
        });
        const galleryService: GalleryService = fixture.debugElement.injector.get(GalleryService);
        galleryService.openGallery(val.id, val.index);
      });
    });

    it(`should call onDownload but image is not downloadable`, () => {
      const mockButtonEvent: ButtonEvent = {
        button: <InternalButtonConfig>{type: ButtonType.DOWNLOAD, id: 1},
        image: null,
        action: Action.CLICK
      };
      const currentImage: InternalLibImage = IMAGES[0];
      comp.id = 0;
      comp.modalImages = IMAGES;
      comp.currentImage = currentImage;
      comp.ngOnChanges(getSimpleChangesMock());
      comp.ngOnInit();
      comp.onDownload(mockButtonEvent);
    });

    it(`should call onClickPreview but with a wrong Image id, so currentImage won't change`, () => {
      const currentImage: InternalLibImage = IMAGES[0];
      comp.id = 0;
      comp.modalImages = IMAGES;
      comp.currentImage = currentImage;
      comp.enableCloseOutside = true;
      comp.ngOnChanges(getSimpleChangesMock());
      comp.ngOnInit();
      comp.onClickPreview(Object.assign({}, IMAGES[1], {id: 1000}));
      expect(comp.currentImage).toEqual(IMAGES[0]);
    });

    it(`should expect isPlainGalleryVisible to be false`, () => {
      comp.plainGalleryConfig = <PlainGalleryConfig>{
        strategy: PlainGalleryStrategy.CUSTOM,
        layout: new AdvancedLayout(0, true),
        hideDefaultPlainGallery: true
      };
      expect(comp.isPlainGalleryVisible()).toBeFalsy();
    });

    it(`shouldn't download, because downloadable is false`, () => {
      const mockButtonEvent: ButtonEvent = {
        button: <InternalButtonConfig>{type: ButtonType.DOWNLOAD, id: 3},
        image: null,
        action: Action.CLICK
      };
      const currentImage: InternalLibImage = IMAGES[0];
      comp.id = 0;
      comp.modalImages = IMAGES;
      comp.currentImage = currentImage;
      comp.currentImageConfig = {downloadable: false}; // images aren't downloadable

      comp.ngOnChanges(getSimpleChangesMock());

      comp.hasData.subscribe(val => {
        expect(val).toBeTruthy();
      });

      comp.ngOnInit();

      comp.buttonBeforeHook.subscribe((event: ButtonEvent) => {
        expect(event.button).toEqual(mockButtonEvent.button);
        expect(event.image).toEqual(currentImage);
        expect(event.action).toEqual(mockButtonEvent.action);
      });

      comp.buttonAfterHook.subscribe((event: ButtonEvent) => {
        expect(event.button).toEqual(mockButtonEvent.button);
        expect(event.image).toEqual(currentImage);
        expect(event.action).toEqual(mockButtonEvent.action);
      });

      comp.onDownload(mockButtonEvent);
    });

    [{galleryId: undefined},{galleryId: -1}].forEach((item, index) => {
      it(`should catch an error calling galleryService closeGallery's method with wrong input data. Test index=${index}`, () => {
        const currentImage: InternalLibImage = IMAGES[0];
        comp.id = 0;
        comp.modalImages = IMAGES;
        comp.currentImage = currentImage;

        comp.ngOnChanges(getSimpleChangesMock());
        comp.ngOnInit();

        comp.show.subscribe(() => fail(`Shouldn't catch a show event`));
        comp.close.subscribe(() => fail(`Shouldn't catch a close event`));

        const expectedError = new Error('Cannot close gallery via GalleryService with galleryId<0 or galleryId===undefined');
        const galleryService = fixture.debugElement.injector.get(GalleryService);
        expect(() => galleryService.closeGallery(item.galleryId)).toThrow(expectedError);
      });
    });

    [{galleryId: undefined, index:0 }, {galleryId:-1, index:0 }, {galleryId:0, index:-1 }].forEach((item, index) => {
      it(`should catch an error calling galleryService openGallery's method with wrong input data. Test index=${index}`, () => {
        const currentImage: InternalLibImage = IMAGES[0];
        comp.id = 0;
        comp.modalImages = IMAGES;
        comp.currentImage = currentImage;

        comp.ngOnChanges(getSimpleChangesMock());
        comp.ngOnInit();

        comp.show.subscribe(() => fail(`Shouldn't catch a show event`));
        comp.close.subscribe(() => fail(`Shouldn't catch a close event`));

        const expectedError = new Error('Cannot open gallery via GalleryService with either index<0 or galleryId<0 or galleryId===undefined');
        const galleryService = fixture.debugElement.injector.get(GalleryService);
        expect(() => galleryService.openGallery(item.galleryId, item.index)).toThrow(expectedError);
      });
    });
  });
});
