/*
 The MIT License (MIT)

 Copyright (c) 2017 Stefano Cappa (Ks89)

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

import {Component, DebugElement, Renderer, Renderer2} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ExternalUrlButtonDirective } from './external-url-button.directive';
import { By } from '@angular/platform-browser';
import { ComponentFixture } from '@angular/core/testing';

@Component({
  selector: 'test-exturl-button',
  template: `
    <a>Link</a>
    <br>
    <a exturl-button>Link</a>
    <a exturl-button [imgExtUrl]="'exturl'">Link</a>
    <a exturl-button [configButtons]="{extUrl: false}" [imgExtUrl]="'exturl'">Link</a>
    <br>
    <a exturl-button [configButtons]="{extUrl: true}" [imgExtUrl]="'exturl'">Link</a>
    <a exturl-button [configButtons]="{extUrl: true, close: true}" [imgExtUrl]="'exturl'">Link</a>
    <a exturl-button [configButtons]="{extUrl: true, close: true}">Link</a>
    <a exturl-button [configButtons]="{extUrl: true, close: false}" [imgExtUrl]="'exturl'">Link</a>
    <br>
    <a exturl-button [configButtons]="{extUrl: false, close: false}" [imgExtUrl]="'exturl'">Link</a>
    <a exturl-button [configButtons]="{extUrl: false, close: true}" [imgExtUrl]="'exturl'">Link</a>
  `
})
class TestExtUrlButtonComponent {}

let fixture: ComponentFixture<TestExtUrlButtonComponent>;
let comp: TestExtUrlButtonComponent;
let des: DebugElement[] = [];
let bareElement: DebugElement;

const expected: any = [
  {right: '0px', hidden: true},
  {right: '0px', hidden: true}, // without imgExtUrl
  {right: '0px', hidden: true},

  {right: '0px', hidden: false},
  {right: '63px', hidden: false},
  {right: '63px', hidden: false}, // without imgExtUrl
  {right: '0px', hidden: false},

  {right: '0px', hidden: true},
  {right: '0px', hidden: true}
];

describe('ExternalUrlButtonDirective', () => {

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [TestExtUrlButtonComponent, ExternalUrlButtonDirective],
      providers: [Renderer]
    }); // not necessary with webpack .compileComponents();

    fixture = TestBed.createComponent(TestExtUrlButtonComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
    return fixture.whenStable().then(() => {
      fixture.detectChanges();
    });
  });

  it('can instantiate it', () => expect(comp).not.toBeNull());

  describe('---YES---', () => {

    beforeEach(() => {
      fixture.detectChanges();
      des = fixture.debugElement.queryAll(By.directive(ExternalUrlButtonDirective));
      // // the h2 without the ExternalUrlButtonDirective
      bareElement = fixture.debugElement.query(By.css('a:not(exturl-button)'));
    });

    it('should have 9 exturl-button elements', () => {
      expect(des.length).toBe(9);
    });

    des.forEach((debugEl: DebugElement, index: number) => {
      it(`should check expected results for <a> at position ${index}`, () => {
        expect(debugEl.nativeElement.style.right).toBe(expected[index].right);
        expect(debugEl.nativeElement.hidden).toBe(expected[index].hidden);
      });
    });

    it('should check expected results for bare <a> without this directive', () => {
      expect(bareElement.properties['exturl-button']).toBeUndefined();
    });
  });
});
