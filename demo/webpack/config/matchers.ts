/*
 * Copyright (C) 2015-2016 Stefano Cappa
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

/* tslint:disable: max-line-length triple-equals */
beforeEach(() => {
  jasmine.addMatchers({

    toHaveText: function () {
      return {
        compare: function (actual, expectedText) {
          const actualText = actual.textContent;
          return {
            pass: actualText == expectedText,
            get message() { return 'Expected ' + actualText + ' to equal ' + expectedText; }
          };
        }
      };
    },

    toContainText: function () {
      return {
        compare: function (actual, expectedText) {
          const actualText = actual.textContent;
          return {
            pass: actualText.indexOf(expectedText) > -1,
            get message() { return 'Expected ' + actualText + ' to contain ' + expectedText; }
          };
        }
      };
    },
    toHaveCssClass: function (util, customEqualityTests) {
      return { compare: buildError(false), negativeCompare: buildError(true) };

      function buildError(isNot: boolean) {
        return function (actual: HTMLElement, className: string) {
          return {
            pass: actual.classList.contains(className) === !isNot,
            get message() {
              return `Expected ${actual.outerHTML} ${isNot ? 'not ' : ''}to contain the CSS class "${className}"`;
            }
          };
        };
      }
    },
    toBeAnInstanceOf: function () {
      return {
        compare: function (actual: any, expectedClass: any) {
          const pass = typeof actual === 'object' && actual instanceof expectedClass;
          return {
            pass: pass,
            get message() {
              return 'Expected ' + actual + ' to be an instance of ' + expectedClass;
            }
          };
        }
      };
    },
  });
});