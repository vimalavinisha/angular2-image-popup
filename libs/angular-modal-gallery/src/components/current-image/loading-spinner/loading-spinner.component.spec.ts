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

import { LoadingSpinnerComponent } from './loading-spinner.component';
import { AccessibilityConfig } from '../../../model/accessibility.interface';
import { LoadingConfig, LoadingType } from '../../../model/loading-config.interface';
import { KS_DEFAULT_ACCESSIBILITY_CONFIG } from '../../../components/accessibility-default';

let comp: LoadingSpinnerComponent;
let fixture: ComponentFixture<LoadingSpinnerComponent>;

const CUSTOM_ACCESSIBILITY: AccessibilityConfig = Object.assign({}, KS_DEFAULT_ACCESSIBILITY_CONFIG);
CUSTOM_ACCESSIBILITY.loadingSpinnerAriaLabel = 'custom loadingSpinnerAriaLabel';
CUSTOM_ACCESSIBILITY.loadingSpinnerTitle = 'custom loadingSpinnerTitle';

const VISIBLE_CONFIG: LoadingConfig[] = [
  {enable: true, type: LoadingType.STANDARD},
  {enable: true, type: LoadingType.BARS},
  {enable: true, type: LoadingType.CIRCULAR},
  {enable: true, type: LoadingType.DOTS}
];

function initTestBed() {
  return TestBed.configureTestingModule({
    declarations: [LoadingSpinnerComponent]
  }).compileComponents();
}

describe('LoadingSpinnerComponent', () => {
  beforeEach(async(() => {
    return initTestBed();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    comp = fixture.componentInstance;
  });

  it('should instantiate it', () => expect(comp).not.toBeNull());

  describe('---YES---', () => {
    VISIBLE_CONFIG.forEach((loadingConfig: LoadingConfig, i: number) => {
      it(`should display loading spinner with default accessibility config. Test i=${i}`, () => {
        comp.loadingConfig = loadingConfig;
        comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
        fixture.detectChanges();

        const element: DebugElement = fixture.debugElement;
        const spinnerContainer: DebugElement = element.query(By.css('div'));
        expect(spinnerContainer).not.toBeUndefined();
        expect(spinnerContainer.name).toBe('div');
        expect(spinnerContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.loadingSpinnerAriaLabel);
        expect(spinnerContainer.properties['title']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.loadingSpinnerTitle);

        switch (loadingConfig.type) {
          case LoadingType.STANDARD:
            const cssLoadLoader: DebugElement = element.query(By.css('div.cssload-loader'));
            expect(cssLoadLoader).not.toBeUndefined();
            expect(cssLoadLoader.name).toBe('div');
            const cssloadInner1: DebugElement = element.query(By.css('div.cssload-inner.cssload-one'));
            expect(cssloadInner1).not.toBeUndefined();
            expect(cssloadInner1.name).toBe('div');
            const cssloadInner2: DebugElement = element.query(By.css('div.cssload-inner.cssload-two'));
            expect(cssloadInner2).not.toBeUndefined();
            expect(cssloadInner2.name).toBe('div');
            const cssloadInner3: DebugElement = element.query(By.css('div.cssload-inner.cssload-three'));
            expect(cssloadInner3).not.toBeUndefined();
            expect(cssloadInner3.name).toBe('div');
            break;
          case LoadingType.DOTS:
            const dotsSpinner: DebugElement = element.query(By.css('div.loader-dots'));
            expect(dotsSpinner).not.toBeUndefined();
            expect(dotsSpinner.name).toBe('div');
            break;
          case LoadingType.CIRCULAR:
            const circularSpinner: DebugElement = element.query(By.css('div.loader-circular'));
            expect(circularSpinner).not.toBeUndefined();
            expect(circularSpinner.name).toBe('div');
            break;
          case LoadingType.BARS:
            const barsSpinner: DebugElement = element.query(By.css('div.loader-bars'));
            expect(barsSpinner).not.toBeUndefined();
            expect(barsSpinner.name).toBe('div');
            break;
        }
      });
    });

    VISIBLE_CONFIG.forEach((loadingConfig: LoadingConfig, i: number) => {
      it(`should display loading spinner with CUSTOM accessibility config. Test i=${i}`, () => {
        comp.loadingConfig = loadingConfig;
        comp.accessibilityConfig = CUSTOM_ACCESSIBILITY;
        fixture.detectChanges();

        const element: DebugElement = fixture.debugElement;
        const spinnerContainer: DebugElement = element.query(By.css('div'));
        expect(spinnerContainer).not.toBeUndefined();
        expect(spinnerContainer.name).toBe('div');
        expect(spinnerContainer.attributes['aria-label']).toBe(CUSTOM_ACCESSIBILITY.loadingSpinnerAriaLabel);
        expect(spinnerContainer.properties['title']).toBe(CUSTOM_ACCESSIBILITY.loadingSpinnerTitle);

        switch (loadingConfig.type) {
          case LoadingType.STANDARD:
            const cssLoadLoader: DebugElement = element.query(By.css('div.cssload-loader'));
            expect(cssLoadLoader).not.toBeUndefined();
            expect(cssLoadLoader.name).toBe('div');
            const cssloadInner1: DebugElement = element.query(By.css('div.cssload-inner.cssload-one'));
            expect(cssloadInner1).not.toBeUndefined();
            expect(cssloadInner1.name).toBe('div');
            const cssloadInner2: DebugElement = element.query(By.css('div.cssload-inner.cssload-two'));
            expect(cssloadInner2).not.toBeUndefined();
            expect(cssloadInner2.name).toBe('div');
            const cssloadInner3: DebugElement = element.query(By.css('div.cssload-inner.cssload-three'));
            expect(cssloadInner3).not.toBeUndefined();
            expect(cssloadInner3.name).toBe('div');
            break;
          case LoadingType.DOTS:
            const dotsSpinner: DebugElement = element.query(By.css('div.loader-dots'));
            expect(dotsSpinner).not.toBeUndefined();
            expect(dotsSpinner.name).toBe('div');
            break;
          case LoadingType.CIRCULAR:
            const circularSpinner: DebugElement = element.query(By.css('div.loader-circular'));
            expect(circularSpinner).not.toBeUndefined();
            expect(circularSpinner.name).toBe('div');
            break;
          case LoadingType.BARS:
            const barsSpinner: DebugElement = element.query(By.css('div.loader-bars'));
            expect(barsSpinner).not.toBeUndefined();
            expect(barsSpinner.name).toBe('div');
            break;
        }
      });
    });
  });
});
