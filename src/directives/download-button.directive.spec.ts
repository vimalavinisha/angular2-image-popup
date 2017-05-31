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

import { Component, DebugElement, Renderer } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DownloadButtonDirective } from './download-button.directive';
import { By } from '@angular/platform-browser';
import { ComponentFixture } from '@angular/core/testing';

@Component({
  selector: 'test-download-button',
  template: `
    <a>Link</a>
    <br>
    <a download-button [imgExtUrl]="'exturl'">Link</a>
    <a download-button [configButtons]="{download: false}" [imgExtUrl]="'exturl'">Link</a>
    <br>
    <a download-button [configButtons]="{download: true}" [imgExtUrl]="'exturl'">Link</a>
    <a download-button [configButtons]="{download: true, extUrl: true}" [imgExtUrl]="'exturl'">Link</a>
    <a download-button [configButtons]="{download: true, extUrl: false}" [imgExtUrl]="'exturl'">Link</a>
    <a download-button [configButtons]="{download: true, extUrl: true, close: true}" [imgExtUrl]="'exturl'">Link</a>
    <a download-button [configButtons]="{download: true, extUrl: true, close: true}">Link</a>
    <a download-button [configButtons]="{download: true, extUrl: true, close: false}" [imgExtUrl]="'exturl'">Link</a>
    <a download-button [configButtons]="{download: true, extUrl: false, close: false}" [imgExtUrl]="'exturl'">Link</a>
    <br>
    <a download-button [configButtons]="{download: false, extUrl: false, close: false}" [imgExtUrl]="'exturl'">Link</a>
    <a download-button [configButtons]="{download: false, extUrl: true, close: false}" [imgExtUrl]="'exturl'">Link</a>
    <a download-button [configButtons]="{download: false, extUrl: false, close: true}" [imgExtUrl]="'exturl'">Link</a>
    <a download-button [configButtons]="{download: false, extUrl: true, close: true}" [imgExtUrl]="'exturl'">Link</a>
  `
})
class TestDownloadButtonComponent {}

let fixture: ComponentFixture<TestDownloadButtonComponent>;
let des: DebugElement[] = [];
let bareElement: DebugElement;

beforeEach(() => {
  TestBed.resetTestingModule();
  fixture = TestBed.configureTestingModule({
    declarations: [TestDownloadButtonComponent, DownloadButtonDirective],
    providers: [Renderer]
  }).createComponent(TestDownloadButtonComponent);
  fixture.detectChanges(); // initial binding
  des = fixture.debugElement.queryAll(By.directive(DownloadButtonDirective));
  // // the h2 without the DownloadButtonDirective
  bareElement = fixture.debugElement.query(By.css('a:not(download-button)'));
});

it('should have 13 download-button elements', () => {
  expect(des.length).toBe(13);
});

const expected: any = [
  { right: '0px', hidden: true },
  { right: '0px', hidden: true },

  { right: '63px', hidden: false },
  { right: '126px', hidden: false },
  { right: '63px', hidden: false },
  { right: '126px', hidden: false },
  { right: '63px', hidden: false }, // without imgExtUrl
  { right: '63px', hidden: false },
  { right: '0px', hidden: false },

  { right: '0px', hidden: true },
  { right: '0px', hidden: true },
  { right: '0px', hidden: true },
  { right: '0px', hidden: true }
];

expected.forEach((val: any, index: number) => {
  it(`should check expected results for <a> at position ${index}`, () => {
    expect(des[index].nativeElement.style.right).toBe(val.right);
    expect(des[index].nativeElement.hidden).toBe(val.hidden);
  });
});

it('should check expected results for bare <a> without this directive', () => {
  expect(bareElement.properties['download-button']).toBeUndefined();
});
