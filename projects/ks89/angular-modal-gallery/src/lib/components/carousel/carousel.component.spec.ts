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
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
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

let comp: CarouselComponent;
let fixture: ComponentFixture<CarouselComponent>;

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

});
