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
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { Image } from '../../model/image.class';
import { InternalButtonConfig, UpperButtonsComponent } from './upper-buttons.component';
import { SizeDirective } from '../../directives/size.directive';
import { ButtonConfig, ButtonEvent, ButtonsConfig, ButtonsStrategy, ButtonType } from '../../model/buttons-config.interface';
import { Action } from '../../model/action.enum';
import { Size } from '../../model/size.interface';
import { KS_DEFAULT_BTN_CLOSE, KS_DEFAULT_BTN_DELETE, KS_DEFAULT_BTN_DOWNLOAD,
  KS_DEFAULT_BTN_EXTURL, KS_DEFAULT_BTN_FULL_SCREEN, KS_DEFAULT_SIZE } from './upper-buttons-default';
import { ConfigService } from '../../services/config.service';

let comp: UpperButtonsComponent;
let fixture: ComponentFixture<UpperButtonsComponent>;

const BAD_IMAGE: any = new Image(0, null);

const IMAGE_EXTURL: Image = new Image(0, {
  img: '../../../../../apps/src/assets/images/gallery/img1.jpg',
  description: 'Description 1',
  extUrl: 'http://www.google.com'
});

const IMAGE_NO_EXTURL: Image = new Image(0, {
  img: '../../../../../apps/src/assets/images/gallery/img1.jpg'
});

const NO_EXTURL_CASES: Image[] = [IMAGE_NO_EXTURL, BAD_IMAGE];

const CUSTOM_SIZE: Size = {height: '40px', width: '40px'};
const CUSTOM_SIZE_AUTO_HEIGHT: Size = {height: 'auto', width: '40px'};
const CUSTOM_SIZE_AUTO_WIDTH: Size = {height: '40px', width: 'auto'};

const UNKNOWN_STRATEGY = 6;
const UNKNOWN_BUTTON_TYPE = 99;


const CUSTOM_BTN: ButtonConfig = {
  className: 'custom-image',
  size: KS_DEFAULT_SIZE,
  type: ButtonType.CUSTOM,
  title: 'Custom title',
  ariaLabel: 'Custom aria label'
};

const WRONG_TYPE_BTN: ButtonConfig = {
  className: 'wrong-type-image',
  size: KS_DEFAULT_SIZE,
  type: UNKNOWN_BUTTON_TYPE,
  title: 'Custom wrong-type title',
  ariaLabel: 'Custom wrong-type aria label'
};

const CUSTOM_FA_BUTTONS: ButtonConfig[] = [
  {
    className: 'fa fa-plus white',
    type: ButtonType.CUSTOM,
    ariaLabel: 'custom plus aria label',
    title: 'custom plus title',
    fontSize: '20px'
  },
  {
    className: 'fa fa-trash white',
    type: ButtonType.DELETE,
    ariaLabel: 'custom delete aria label',
    title: 'custom delete title',
    fontSize: '20px'
  },
  {
    className: 'fa fa-close white',
    type: ButtonType.CLOSE,
    ariaLabel: 'custom close aria label',
    title: 'custom close title',
    fontSize: '20px'
  },
  // {
  //   className: 'fa fa-refresh white',
  //   type: ButtonType.REFRESH,
  //   ariaLabel: 'custom refresh aria label',
  //   title: 'custom refresh title',
  //   fontSize: '20px'
  // },
  {
    className: 'fa fa-download white',
    type: ButtonType.DOWNLOAD,
    ariaLabel: 'custom download aria label',
    title: 'custom download title',
    fontSize: '20px'
  },
  {
    className: 'fa fa-external-link white',
    type: ButtonType.EXTURL,
    ariaLabel: 'custom exturl aria label',
    title: 'custom exturl title',
    fontSize: '20px'
  }];

const VISIBILITY_CASES: ButtonsConfig[] = [
  {visible: false, strategy: ButtonsStrategy.DEFAULT},
  {visible: false, strategy: ButtonsStrategy.SIMPLE},
  {visible: false, strategy: ButtonsStrategy.ADVANCED},
  {visible: false, strategy: ButtonsStrategy.FULL},
  {visible: false, strategy: ButtonsStrategy.CUSTOM}
];

const DEFAULT_CASES: ButtonsConfig[] = [
  {visible: true, strategy: ButtonsStrategy.DEFAULT},
  {visible: true, strategy: ButtonsStrategy.SIMPLE},
  {visible: true, strategy: ButtonsStrategy.ADVANCED},
  {visible: true, strategy: ButtonsStrategy.FULL}
];

const CUSTOM_NO_BUTTONS_CASES: ButtonsConfig[] = [{visible: true, strategy: ButtonsStrategy.CUSTOM}];

// should be ignored by the component and consider ButtonStrategy
const IGNORE_CUSTOM_CASES: ButtonsConfig[] = [
  {visible: true, strategy: ButtonsStrategy.DEFAULT, buttons: [CUSTOM_BTN]},
  {visible: true, strategy: ButtonsStrategy.SIMPLE, buttons: [CUSTOM_BTN]},
  {visible: true, strategy: ButtonsStrategy.ADVANCED, buttons: [CUSTOM_BTN]},
  {visible: true, strategy: ButtonsStrategy.FULL, buttons: [CUSTOM_BTN]}
];

const UNKNOWN_CASES: ButtonsConfig[] = [
  {visible: true, strategy: UNKNOWN_STRATEGY, buttons: [CUSTOM_BTN]},
  {visible: true, strategy: UNKNOWN_STRATEGY}
];

const CUSTOM_CASES: ButtonsConfig[] = [
  {visible: true, strategy: ButtonsStrategy.CUSTOM, buttons: [CUSTOM_BTN]},
  {visible: true, strategy: ButtonsStrategy.CUSTOM, buttons: [CUSTOM_BTN, CUSTOM_BTN]},
  {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [KS_DEFAULT_BTN_CLOSE, CUSTOM_BTN, CUSTOM_BTN, KS_DEFAULT_BTN_DOWNLOAD, KS_DEFAULT_BTN_DOWNLOAD]
  },
  {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [KS_DEFAULT_BTN_DOWNLOAD, KS_DEFAULT_BTN_CLOSE, /* KS_DEFAULT_BTN_REFRESH*/
      KS_DEFAULT_BTN_DELETE, KS_DEFAULT_BTN_EXTURL, KS_DEFAULT_BTN_CLOSE]
  }
];

const CUSTOM_SIZES: ButtonsConfig[] = [
  {
    visible: true, strategy: ButtonsStrategy.CUSTOM, buttons: [
      buildBtnWithCustomSize(ButtonType.DOWNLOAD, CUSTOM_SIZE), buildBtnWithCustomSize(ButtonType.CLOSE, CUSTOM_SIZE),
      // buildBtnWithCustomSize(ButtonType.EXTURL, CUSTOM_SIZE), buildBtnWithCustomSize(ButtonType.REFRESH, CUSTOM_SIZE),
      buildBtnWithCustomSize(ButtonType.CUSTOM, CUSTOM_SIZE), buildBtnWithCustomSize(ButtonType.DELETE, CUSTOM_SIZE)]
  },
  {
    visible: true, strategy: ButtonsStrategy.CUSTOM, buttons: [
      buildBtnWithCustomSize(ButtonType.DOWNLOAD, CUSTOM_SIZE_AUTO_HEIGHT), buildBtnWithCustomSize(ButtonType.CLOSE, CUSTOM_SIZE_AUTO_HEIGHT),
      // buildBtnWithCustomSize(ButtonType.EXTURL, CUSTOM_SIZE_AUTO_HEIGHT), buildBtnWithCustomSize(ButtonType.REFRESH, CUSTOM_SIZE_AUTO_HEIGHT),
      buildBtnWithCustomSize(ButtonType.CUSTOM, CUSTOM_SIZE_AUTO_HEIGHT), buildBtnWithCustomSize(ButtonType.DELETE, CUSTOM_SIZE_AUTO_HEIGHT)]
  },
  {
    visible: true, strategy: ButtonsStrategy.CUSTOM, buttons: [
      buildBtnWithCustomSize(ButtonType.DOWNLOAD, CUSTOM_SIZE_AUTO_WIDTH), buildBtnWithCustomSize(ButtonType.CLOSE, CUSTOM_SIZE_AUTO_WIDTH),
      // buildBtnWithCustomSize(ButtonType.EXTURL, CUSTOM_SIZE_AUTO_WIDTH), buildBtnWithCustomSize(ButtonType.REFRESH, CUSTOM_SIZE_AUTO_WIDTH),
      buildBtnWithCustomSize(ButtonType.CUSTOM, CUSTOM_SIZE_AUTO_WIDTH), buildBtnWithCustomSize(ButtonType.DELETE, CUSTOM_SIZE_AUTO_WIDTH)]
  }
];

const CUSTOM_FA_CASES: ButtonsConfig[] = [{visible: true, strategy: ButtonsStrategy.CUSTOM, buttons: CUSTOM_FA_BUTTONS}];

const NOT_VALID_BTN_TYPE_CASES: ButtonsConfig[] = [
  {visible: true, strategy: ButtonsStrategy.CUSTOM, buttons: [WRONG_TYPE_BTN]}
];

const EXTURL_BTN_NEW_TAB: ButtonConfig = Object.assign({}, KS_DEFAULT_BTN_EXTURL, {extUrlInNewTab: true});

const EXT_URL_IN_A_NEW_TAB_CASES: ButtonsConfig[] = [
  {visible: true, strategy: ButtonsStrategy.CUSTOM, buttons: [EXTURL_BTN_NEW_TAB]},
  {visible: true, strategy: ButtonsStrategy.CUSTOM, buttons: [CUSTOM_BTN, EXTURL_BTN_NEW_TAB]},
  {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [KS_DEFAULT_BTN_CLOSE, EXTURL_BTN_NEW_TAB, CUSTOM_BTN, KS_DEFAULT_BTN_DOWNLOAD, KS_DEFAULT_BTN_DOWNLOAD]
  },
  {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [KS_DEFAULT_BTN_DOWNLOAD, KS_DEFAULT_BTN_CLOSE, /* KS_DEFAULT_BTN_REFRESH, */ KS_DEFAULT_BTN_DELETE, EXTURL_BTN_NEW_TAB]
  }
];

function getButtonEvent(button: ButtonConfig): ButtonEvent {
  return {
    button: button,
    // upper-buttons.component always returns a null image to the main component, so I should test for a null
    image: null,
    action: Action.CLICK
  };
}

function updateInputs(image: Image, configButtons: ButtonsConfig) {
  const configService = fixture.debugElement.injector.get(ConfigService);
  configService.set({buttonsConfig: configButtons});
  comp.currentImage = image;
  comp.ngOnInit();
  fixture.detectChanges();
}

function buildBtnWithCustomSize(btnType: ButtonType, size: Size) {
  switch (btnType) {
    case ButtonType.CLOSE:
      return Object.assign({}, KS_DEFAULT_BTN_CLOSE, {size: size});
    case ButtonType.DOWNLOAD:
      return Object.assign({}, KS_DEFAULT_BTN_DOWNLOAD, {size: size});
    case ButtonType.EXTURL:
      return Object.assign({}, KS_DEFAULT_BTN_EXTURL, {size: size});
    case ButtonType.DELETE:
      return Object.assign({}, KS_DEFAULT_BTN_DELETE, {size: size});
    // case ButtonType.REFRESH:
    //   return Object.assign({}, KS_DEFAULT_BTN_REFRESH, {size: size});
    case ButtonType.FULLSCREEN:
      return Object.assign({}, KS_DEFAULT_BTN_FULL_SCREEN, {size: size});
    case ButtonType.CUSTOM:
      return Object.assign({}, CUSTOM_BTN, {size: size});
    default:
      fail('this test should run only with known button types');
  }
}

function testCurrentHtmlBtn(btnDebugElement: DebugElement, btnIndex: number, size: Size) {
  const currentButton: InternalButtonConfig = comp.buttons[btnIndex];
  expect(btnDebugElement.name).toBe('a');
  expect(btnDebugElement.attributes['class']).toBe('upper-button');
  expect(btnDebugElement.attributes['kssize']).not.toBeNull();
  expect(btnDebugElement.attributes['sizeConfig']).toBeUndefined();
  if (size) {
    expect(btnDebugElement.styles.width).toBe(size.width);
    expect(btnDebugElement.styles.height).toBe(size.height);
  }
  expect(btnDebugElement.attributes['aria-label']).toBe(currentButton.ariaLabel);
  expect(btnDebugElement.attributes['role']).toBe('button');
  expect(btnDebugElement.properties['tabIndex']).toBe(0);
  // expect(btnDebugElement.properties['hidden']).toBe(false);

  // console.log('btnDebugElement.attributes ' + btnIndex, btnDebugElement.attributes);
  // console.log('btnDebugElement.properties ' + btnIndex, btnDebugElement.properties);

  if (currentButton.fontSize) {
    expect(btnDebugElement.nativeElement.style.fontSize).toBe(currentButton.fontSize);
  }
  if (currentButton.size) {
    expect(btnDebugElement.nativeElement.style.width).toBe(currentButton.size.width);
    expect(btnDebugElement.nativeElement.style.height).toBe(currentButton.size.height);
  }

  const childrenElements: DebugElement[] = btnDebugElement.children;
  expect(childrenElements.length).toBe(1);
  expect(childrenElements[0].attributes['aria-hidden']).toBe('true');
  expect(childrenElements[0].properties['className']).toBe('inside ' + currentButton.className);
  expect(childrenElements[0].properties['title']).toBe(currentButton.title);
  // console.log('childrenElements.attributes ' + btnIndex, childrenElements[0].attributes);
  // console.log('childrenElements.properties ' + btnIndex, childrenElements[0].properties);
}

function testBtnNumberByStrategy(strategy: ButtonsStrategy, btnDebugElementsCount: number) {
  switch (strategy) {
    case ButtonsStrategy.DEFAULT:
      expect(btnDebugElementsCount).toBe(1);
      break;
    case ButtonsStrategy.SIMPLE:
      expect(btnDebugElementsCount).toBe(2);
      break;
    case ButtonsStrategy.ADVANCED:
      expect(btnDebugElementsCount).toBe(3);
      break;
    case ButtonsStrategy.FULL:
      expect(btnDebugElementsCount).toBe(5); // with refresh this must be 5
      break;
    case ButtonsStrategy.CUSTOM:
      // no constraints with custom strategy
      break;
    default:
      fail('input strategy is not allowed');
      break;
  }
}

function initTestBed() {
  return TestBed.configureTestingModule({
    declarations: [UpperButtonsComponent, SizeDirective]
  }).overrideComponent(UpperButtonsComponent, {
    set: {
      providers: [
        {
          provide: ConfigService,
          useClass: ConfigService
        }
      ]
    }
  });
}

describe('UpperButtonsComponent', () => {
  beforeEach(async(() => {
    return initTestBed();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpperButtonsComponent);
    comp = fixture.componentInstance;
  });

  it('should instantiate it', () => expect(comp).not.toBeNull());

  describe('---YES---', () => {

    DEFAULT_CASES.forEach((currentButtonConfig: ButtonsConfig, index: number) => {
      it(`should display buttons for every default buttonConfigs and subscribe to click events. Test i=${index}`, () => {
        updateInputs(IMAGE_EXTURL, currentButtonConfig);

        // expect a valid ButtonStrategy because passed to this test as input (via currentButtonConfig)
        expect(ButtonsStrategy[currentButtonConfig.strategy]).not.toBeUndefined();

        const element: DebugElement = fixture.debugElement;
        const btns: DebugElement[] = element.queryAll(By.css('a.upper-button'));

        testBtnNumberByStrategy(currentButtonConfig.strategy, btns.length);

        comp.close.subscribe((res: ButtonEvent) => {
          expect(res).toEqual(getButtonEvent(KS_DEFAULT_BTN_CLOSE));
        });
        // comp.refresh.subscribe((res: ButtonEvent) => {
        //   expect(res).toEqual(getButtonEvent(KS_DEFAULT_BTN_REFRESH));
        // });
        comp.delete.subscribe((res: ButtonEvent) => {
          expect(res).toEqual(getButtonEvent(KS_DEFAULT_BTN_DELETE));
        });
        comp.navigate.subscribe((res: ButtonEvent) => {
          expect(res).toEqual(getButtonEvent(KS_DEFAULT_BTN_EXTURL));
        });
        comp.download.subscribe((res: ButtonEvent) => {
          expect(res).toEqual(getButtonEvent(KS_DEFAULT_BTN_DOWNLOAD));
        });
        comp.fullscreen.subscribe((res: ButtonEvent) => {
          expect(res).toEqual(getButtonEvent(KS_DEFAULT_BTN_FULL_SCREEN));
        });

        // iterate over all buttons from LEFT TO RIGHT (from 'refresh' -> to 'close')
        // testing html elements, attributes and properties
        btns.forEach((debugElement: DebugElement, btnIndex: number) => {
          testCurrentHtmlBtn(debugElement, btnIndex, KS_DEFAULT_SIZE);
        });

        // iterate over all buttons from LEFT TO RIGHT (from 'refresh' -> to 'close')
        // clicking all of them
        btns.forEach((debugElement: DebugElement) => {
          debugElement.nativeElement.click();
        });
      });
    });

    IGNORE_CUSTOM_CASES.forEach((currentButtonConfig: ButtonsConfig, index: number) => {
      it(`should show default buttons ignoring custom ones passed as input, because strategy != CUSTOM. Test i=${index}`, () => {
        updateInputs(IMAGE_EXTURL, currentButtonConfig);

        // expect a valid ButtonStrategy because passed to this test as input (via currentButtonConfig)
        expect(ButtonsStrategy[currentButtonConfig.strategy]).not.toBeUndefined();

        const element: DebugElement = fixture.debugElement;
        const btns: DebugElement[] = element.queryAll(By.css('a.upper-button'));

        testBtnNumberByStrategy(currentButtonConfig.strategy, btns.length);

        comp.close.subscribe((res: ButtonEvent) => {
          expect(res).toEqual(getButtonEvent(KS_DEFAULT_BTN_CLOSE));
        });
        // comp.refresh.subscribe((res: ButtonEvent) => {
        //   expect(res).toEqual(getButtonEvent(KS_DEFAULT_BTN_REFRESH));
        // });
        comp.delete.subscribe((res: ButtonEvent) => {
          expect(res).toEqual(getButtonEvent(KS_DEFAULT_BTN_DELETE));
        });
        comp.navigate.subscribe((res: ButtonEvent) => {
          expect(res).toEqual(getButtonEvent(KS_DEFAULT_BTN_EXTURL));
        });
        comp.download.subscribe((res: ButtonEvent) => {
          expect(res).toEqual(getButtonEvent(KS_DEFAULT_BTN_DOWNLOAD));
        });
        comp.fullscreen.subscribe((res: ButtonEvent) => {
          expect(res).toEqual(getButtonEvent(KS_DEFAULT_BTN_FULL_SCREEN));
        });

        // iterate over all buttons from LEFT TO RIGHT (from 'refresh' -> to 'close')
        // testing html elements, attributes and properties
        btns.forEach((debugElement: DebugElement, btnIndex: number) => {
          testCurrentHtmlBtn(debugElement, btnIndex, KS_DEFAULT_SIZE);
        });

        // iterate over all buttons from LEFT TO RIGHT (from 'refresh' -> to 'close')
        // clicking all of them
        btns.forEach((debugElement: DebugElement) => {
          debugElement.nativeElement.click();
        });
      });
    });

    [DEFAULT_CASES[2], DEFAULT_CASES[3]].forEach((currentButtonConfig: ButtonsConfig, i: number) => {
      NO_EXTURL_CASES.forEach((image: Image, j: number) => {
        it(`shouldn't catch a navigate event, because either input image isn't valid or extUrl isn't defined. Test i=${i} j=${j}`, () => {
          updateInputs(image, currentButtonConfig);

          // expect a valid ButtonStrategy because passed to this test as input (via currentButtonConfig)
          expect(ButtonsStrategy[currentButtonConfig.strategy]).not.toBeUndefined();

          const element: DebugElement = fixture.debugElement;
          const btns: DebugElement[] = element.queryAll(By.css('a.upper-button'));

          testBtnNumberByStrategy(currentButtonConfig.strategy, btns.length);

          comp.navigate.subscribe((res: ButtonEvent) => {
            fail('navigate output should be never called, because input image is not valid or extUrl is not defined');
          });
          comp.close.subscribe((res: ButtonEvent) => {
            expect(res).toEqual(getButtonEvent(KS_DEFAULT_BTN_CLOSE));
          });
          // comp.refresh.subscribe((res: ButtonEvent) => {
          //   expect(res).toEqual(getButtonEvent(KS_DEFAULT_BTN_REFRESH));
          // });
          comp.delete.subscribe((res: ButtonEvent) => {
            expect(res).toEqual(getButtonEvent(KS_DEFAULT_BTN_DELETE));
          });
          comp.download.subscribe((res: ButtonEvent) => {
            expect(res).toEqual(getButtonEvent(KS_DEFAULT_BTN_DOWNLOAD));
          });
          comp.fullscreen.subscribe((res: ButtonEvent) => {
            expect(res).toEqual(getButtonEvent(KS_DEFAULT_BTN_FULL_SCREEN));
          });

          // iterate over all buttons from LEFT TO RIGHT (from 'refresh' -> to 'close')
          // testing html elements, attributes and properties
          btns.forEach((debugElement: DebugElement, btnIndex: number) => {
            testCurrentHtmlBtn(debugElement, btnIndex, KS_DEFAULT_SIZE);
          });

          // iterate over all buttons from LEFT TO RIGHT (from 'refresh' -> to 'close')
          // clicking all of them
          btns.forEach((debugElement: DebugElement) => {
            debugElement.nativeElement.click();
          });
        });
      });
    });

    CUSTOM_CASES.forEach((currentButtonConfig: ButtonsConfig, index: number) => {
      it(`should display custom + default buttons and subscribe to click events. Test i=${index}`, () => {
        updateInputs(IMAGE_EXTURL, currentButtonConfig);

        // expect a valid ButtonStrategy because passed to this test as input (via currentButtonConfig)
        expect(ButtonsStrategy[currentButtonConfig.strategy]).not.toBeUndefined();

        const element: DebugElement = fixture.debugElement;
        const btns: DebugElement[] = element.queryAll(By.css('a.upper-button'));

        comp.close.subscribe((res: ButtonEvent) => {
          expect(res).toEqual(getButtonEvent(KS_DEFAULT_BTN_CLOSE));
        });
        // comp.refresh.subscribe((res: ButtonEvent) => {
        //   expect(res).toEqual(getButtonEvent(KS_DEFAULT_BTN_REFRESH));
        // });
        comp.delete.subscribe((res: ButtonEvent) => {
          expect(res).toEqual(getButtonEvent(KS_DEFAULT_BTN_DELETE));
        });
        comp.navigate.subscribe((res: ButtonEvent) => {
          expect(res).toEqual(getButtonEvent(KS_DEFAULT_BTN_EXTURL));
        });
        comp.download.subscribe((res: ButtonEvent) => {
          expect(res).toEqual(getButtonEvent(KS_DEFAULT_BTN_DOWNLOAD));
        });
        comp.customEmit.subscribe((res: ButtonEvent) => {
          expect(res).toEqual(getButtonEvent(CUSTOM_BTN));
        });
        comp.fullscreen.subscribe((res: ButtonEvent) => {
          expect(res).toEqual(getButtonEvent(KS_DEFAULT_BTN_FULL_SCREEN));
        });

        // iterate over all buttons from LEFT TO RIGHT
        // testing html elements, attributes and properties
        btns.forEach((debugElement: DebugElement, btnIndex: number) => {
          testCurrentHtmlBtn(debugElement, btnIndex, KS_DEFAULT_SIZE);
        });

        // iterate over all buttons from LEFT TO RIGHT
        // clicking all of them
        btns.forEach((debugElement: DebugElement) => {
          debugElement.nativeElement.click();
        });
      });
    });

    EXT_URL_IN_A_NEW_TAB_CASES.forEach((currentButtonConfig: ButtonsConfig, index: number) => {
      it(`should display buttons where extUrl buttons open extUrl in a new tab and subscribe to click events. Test i=${index}`, () => {
        updateInputs(IMAGE_EXTURL, currentButtonConfig);

        // expect a valid ButtonStrategy because passed to this test as input (via currentButtonConfig)
        expect(ButtonsStrategy[currentButtonConfig.strategy]).not.toBeUndefined();

        const element: DebugElement = fixture.debugElement;
        const btns: DebugElement[] = element.queryAll(By.css('a.upper-button'));

        comp.close.subscribe((res: ButtonEvent) => {
          expect(res).toEqual(getButtonEvent(KS_DEFAULT_BTN_CLOSE));
        });
        // comp.refresh.subscribe((res: ButtonEvent) => {
        //   expect(res).toEqual(getButtonEvent(KS_DEFAULT_BTN_REFRESH));
        // });
        comp.delete.subscribe((res: ButtonEvent) => {
          expect(res).toEqual(getButtonEvent(KS_DEFAULT_BTN_DELETE));
        });
        comp.navigate.subscribe((res: ButtonEvent) => {
          expect(res).toEqual(getButtonEvent(EXTURL_BTN_NEW_TAB));
        });
        comp.download.subscribe((res: ButtonEvent) => {
          expect(res).toEqual(getButtonEvent(KS_DEFAULT_BTN_DOWNLOAD));
        });
        comp.customEmit.subscribe((res: ButtonEvent) => {
          expect(res).toEqual(getButtonEvent(CUSTOM_BTN));
        });
        comp.fullscreen.subscribe((res: ButtonEvent) => {
          expect(res).toEqual(getButtonEvent(KS_DEFAULT_BTN_FULL_SCREEN));
        });

        // iterate over all buttons from LEFT TO RIGHT
        // testing html elements, attributes and properties
        btns.forEach((debugElement: DebugElement, btnIndex: number) => {
          testCurrentHtmlBtn(debugElement, btnIndex, KS_DEFAULT_SIZE);
        });

        // iterate over all buttons from LEFT TO RIGHT
        // clicking all of them
        btns.forEach((debugElement: DebugElement) => {
          debugElement.nativeElement.click();
        });
      });
    });

    CUSTOM_FA_CASES.forEach((currentButtonConfig: ButtonsConfig, index: number) => {
      it(`should display custom buttons (with different types) with FontAwesome and subscribe to click events. Test i=${index}`, () => {
        updateInputs(IMAGE_EXTURL, currentButtonConfig);

        // expect a valid ButtonStrategy because passed to this test as input (via currentButtonConfig)
        expect(ButtonsStrategy[currentButtonConfig.strategy]).not.toBeUndefined();

        const element: DebugElement = fixture.debugElement;
        const btns: DebugElement[] = element.queryAll(By.css('a.upper-button'));

        comp.close.subscribe((res: ButtonEvent) => {
          expect(res).toEqual(getButtonEvent(CUSTOM_FA_BUTTONS[2]));
        });
        // comp.refresh.subscribe((res: ButtonEvent) => {
        //   expect(res).toEqual(getButtonEvent(CUSTOM_FA_BUTTONS[3]));
        // });
        comp.delete.subscribe((res: ButtonEvent) => {
          expect(res).toEqual(getButtonEvent(CUSTOM_FA_BUTTONS[1]));
        });
        comp.navigate.subscribe((res: ButtonEvent) => {
          expect(res).toEqual(getButtonEvent(CUSTOM_FA_BUTTONS[4]));
        });
        comp.download.subscribe((res: ButtonEvent) => {
          expect(res).toEqual(getButtonEvent(CUSTOM_FA_BUTTONS[3]));
        });
        comp.customEmit.subscribe((res: ButtonEvent) => {
          expect(res).toEqual(getButtonEvent(CUSTOM_FA_BUTTONS[0]));
        });

        // iterate over all buttons from LEFT TO RIGHT
        // testing html elements, attributes and properties
        btns.forEach((debugElement: DebugElement, btnIndex: number) => {
          testCurrentHtmlBtn(debugElement, btnIndex, null);
        });

        // iterate over all buttons from LEFT TO RIGHT
        // clicking all of them
        btns.forEach((debugElement: DebugElement) => {
          debugElement.nativeElement.click();
        });
      });
    });

    CUSTOM_SIZES.forEach((currentButtonConfig: ButtonsConfig, index: number) => {
      it(`should display custom buttons (with different types) with custom sizes. Test i=${index}`, () => {
        updateInputs(IMAGE_EXTURL, currentButtonConfig);

        // expect a valid ButtonStrategy because passed to this test as input (via currentButtonConfig)
        expect(ButtonsStrategy[currentButtonConfig.strategy]).not.toBeUndefined();

        const element: DebugElement = fixture.debugElement;
        const btns: DebugElement[] = element.queryAll(By.css('a.upper-button'));

        // iterate over all buttons from LEFT TO RIGHT
        // testing html elements, attributes and properties
        btns.forEach((debugElement: DebugElement, btnIndex: number) => {
          switch (index) {
            case 0:
              testCurrentHtmlBtn(debugElement, btnIndex, CUSTOM_SIZE);
              break;
            case 1:
              testCurrentHtmlBtn(debugElement, btnIndex, CUSTOM_SIZE_AUTO_HEIGHT);
              break;
            case 2:
              testCurrentHtmlBtn(debugElement, btnIndex, CUSTOM_SIZE_AUTO_WIDTH);
              break;
          }
        });
      });
    });
  });

  describe('---NO---', () => {

    VISIBILITY_CASES.forEach((currentButtonConfig: ButtonsConfig, index: number) => {
      it(`shouldn't find any buttons, because visibility is false. Test i=${index}`, () => {
        updateInputs(IMAGE_EXTURL, currentButtonConfig);

        // expect a valid ButtonStrategy because passed to this test as input (via currentButtonConfig)
        expect(ButtonsStrategy[currentButtonConfig.strategy]).not.toBeUndefined();

        const element: DebugElement = fixture.debugElement;

        const btnDebugElement: DebugElement = element.query(By.directive(SizeDirective));
        expect(btnDebugElement).toBeNull();

        const btns: DebugElement[] = element.queryAll(By.css('a.upper-button'));
        expect(btns.length).toBe(0);
      });
    });

    UNKNOWN_CASES.forEach((currentButtonConfig: ButtonsConfig, index: number) => {
      it(`should display default buttons (DEFAULT strategy), because input strategy is unknown. Test i=${index}`, () => {
        updateInputs(IMAGE_EXTURL, currentButtonConfig);

        // expect an UNKNOWN ButtonStrategy because passed to this test as input (via currentButtonConfig)
        expect(ButtonsStrategy[currentButtonConfig.strategy]).toBeUndefined();

        const element: DebugElement = fixture.debugElement;
        const btns: DebugElement[] = element.queryAll(By.css('a.upper-button'));
        expect(btns.length).toBe(1);

        comp.close.subscribe((res: ButtonEvent) => {
          expect(res).toEqual(getButtonEvent(KS_DEFAULT_BTN_CLOSE));
        });

        // iterate over all buttons from LEFT TO RIGHT (from 'refresh' -> to 'close')
        // testing html elements, attributes and properties
        btns.forEach((debugElement: DebugElement, btnIndex: number) => {
          testCurrentHtmlBtn(debugElement, btnIndex, KS_DEFAULT_SIZE);
        });

        // iterate over all buttons from LEFT TO RIGHT (from 'refresh' -> to 'close')
        // clicking all of them
        btns.forEach((debugElement: DebugElement) => {
          debugElement.nativeElement.click();
        });
      });
    });

    CUSTOM_NO_BUTTONS_CASES.forEach((currentButtonConfig: ButtonsConfig, index: number) => {
      it(`shouldn't display anything, because custom config requires a buttons array. Test i=${index}`, () => {
        updateInputs(IMAGE_EXTURL, currentButtonConfig);

        // expect a valid ButtonStrategy because passed to this test as input (via currentButtonConfig)
        expect(ButtonsStrategy[currentButtonConfig.strategy]).not.toBeUndefined();

        const element: DebugElement = fixture.debugElement;
        const btns: DebugElement[] = element.queryAll(By.css('a.upper-button'));
        expect(btns.length).toBe(0);
      });
    });
  });

  describe('---ERROR---', () => {

    NOT_VALID_BTN_TYPE_CASES.forEach((currentButtonConfig: ButtonsConfig, index: number) => {
      it(`should throw an error, because all buttons must have valid types. Test i=${index}`, () => {
        const ERROR: Error = new Error('Unknown ButtonType. For custom types use ButtonType.CUSTOM');
        expect(() => updateInputs(IMAGE_EXTURL, currentButtonConfig)).toThrow(ERROR);
      });
    });
  });
});
