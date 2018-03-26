/*
 The MIT License (MIT)

 Copyright (c) 2017-2018 Stefano Cappa (Ks89)

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

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DescriptionDirective } from './description.directive';
import { Description, DescriptionStrategy } from '../model/description.interface';

const expected: Description[] = [
  {strategy: DescriptionStrategy.ALWAYS_VISIBLE,
    margin: {marginTop: '0px', marginBottom: '5px', marginLeft: '0px', marginRight: '0px'},
    style: {bgColor: '(0,0,0,.5)', textColor: 'white'}},
  {strategy: DescriptionStrategy.ALWAYS_VISIBLE,
    margin: {marginTop: '0px', marginBottom: '5px', marginLeft: '0px', marginRight: '0px'}},
  {strategy: DescriptionStrategy.ALWAYS_VISIBLE,
    style: {bgColor: '(0,0,0,.5)', textColor: 'white'}},
  {strategy: DescriptionStrategy.ALWAYS_VISIBLE,
    margin: {marginBottom: '0px'},
    style: {bgColor: '(255,0,0,.5)'}},
  {strategy: DescriptionStrategy.ALWAYS_VISIBLE, margin: {}, style: {}},
  {strategy: DescriptionStrategy.ALWAYS_VISIBLE, margin: null, style: null},
  {strategy: DescriptionStrategy.ALWAYS_VISIBLE}
];

@Component({
  selector: 'ks-test-description',
  template: `
    <figure><figcaption ksDescription [description]="expected[0]"></figcaption></figure>
  `
})
class TestDescriptionComponent {
  expected: Description[] = [
    {strategy: DescriptionStrategy.ALWAYS_VISIBLE,
      margin: {marginTop: '0px', marginBottom: '5px', marginLeft: '0px', marginRight: '0px'},
      style: {bgColor: '(0,0,0,.5)', textColor: 'white'}},
    {strategy: DescriptionStrategy.ALWAYS_VISIBLE,
      margin: {marginTop: '0px', marginBottom: '5px', marginLeft: '0px', marginRight: '0px'}},
    {strategy: DescriptionStrategy.ALWAYS_VISIBLE,
      style: {bgColor: '(0,0,0,.5)', textColor: 'white'}},
    {strategy: DescriptionStrategy.ALWAYS_VISIBLE,
      margin: {marginBottom: '0px'},
      style: {bgColor: '(255,0,0,.5)'}},
    {strategy: DescriptionStrategy.ALWAYS_VISIBLE, margin: {}, style: {}},
    {strategy: DescriptionStrategy.ALWAYS_VISIBLE, margin: null, style: null},
    {strategy: DescriptionStrategy.ALWAYS_VISIBLE}
  ];
}

let fixture: ComponentFixture<TestDescriptionComponent>;
let comp: TestDescriptionComponent;
let des: DebugElement[] = [];
let bareElement: DebugElement;

describe('DescriptionDirective', () => {

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [TestDescriptionComponent, DescriptionDirective]
    }); // not necessary with webpack .compileComponents();
    fixture = TestBed.createComponent(TestDescriptionComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
    return fixture.whenStable().then(() => {
      fixture.detectChanges();
      bareElement = fixture.debugElement.query(By.css('div:not(ksDescription)'));
      des = fixture.debugElement.queryAll(By.directive(DescriptionDirective));
    });
  });

  it('can instantiate it', () => expect(comp).not.toBeNull());

  describe('---tests---', () => {

    beforeEach(() => fixture.detectChanges());

    it('should have this directive', () => {
      expect(des.length).toBe(expected.length);
    });

    expected.forEach((val: Description, index: number) => {
      it(`should check expected results for <figcaption> at position ${index}`, () => {
        // expect(des[index].nativeElement.style.width).toBe(val.width);
        // expect(des[index].nativeElement.style.height).toBe(val.height);
      });
    });

    it('should check expected results for bare <figcaption> without this directive', () => {
      expect(bareElement.properties['ksDescription']).toBeUndefined();
    });
  });
});
