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
  {
    strategy: DescriptionStrategy.ALWAYS_VISIBLE,
    style: {bgColor: 'rbga(0,0,0,.5)', textColor: 'white', margin: {marginTop: '0px', marginBottom: '5px', marginLeft: '0px', marginRight: '0px'}}
  },
  {
    strategy: DescriptionStrategy.ALWAYS_VISIBLE,
    style: {margin: {marginTop: '0px', marginBottom: '5px', marginLeft: '0px', marginRight: '0px'}}
  },
  {
    strategy: DescriptionStrategy.ALWAYS_VISIBLE,
    style: {bgColor: 'rbga(0,0,0,.5)', textColor: 'white'}
  },
  {
    strategy: DescriptionStrategy.ALWAYS_VISIBLE,
    style: {bgColor: 'rbga(255,0,0,.5)', margin: {marginBottom: '0px'}}
  },
  {strategy: DescriptionStrategy.ALWAYS_VISIBLE, style: {}},
  {strategy: DescriptionStrategy.ALWAYS_VISIBLE, style: {margin: {}}},
  {strategy: DescriptionStrategy.ALWAYS_VISIBLE, style: null},
  {strategy: DescriptionStrategy.ALWAYS_VISIBLE}
];

@Component({
  selector: 'ks-test-description',
  template: `
    <figure>
      <figcaption ksDescription [description]="descriptions[0]"></figcaption>
    </figure>
    <figure>
      <figcaption ksDescription [description]="descriptions[1]"></figcaption>
    </figure>
    <figure>
      <figcaption ksDescription [description]="descriptions[2]"></figcaption>
    </figure>
    <figure>
      <figcaption ksDescription [description]="descriptions[3]"></figcaption>
    </figure>
    <figure>
      <figcaption ksDescription [description]="descriptions[4]"></figcaption>
    </figure>
    <figure>
      <figcaption ksDescription [description]="descriptions[5]"></figcaption>
    </figure>
    <figure>
      <figcaption ksDescription [description]="descriptions[6]"></figcaption>
    </figure>
    <figure>
      <figcaption ksDescription [description]="descriptions[7]"></figcaption>
    </figure>
  `
})
class TestDescriptionComponent {
  descriptions: Description[] = [
    {
      strategy: DescriptionStrategy.ALWAYS_VISIBLE,
      style: {bgColor: 'rbga(0,0,0,.5)', textColor: 'white', margin: {marginTop: '0px', marginBottom: '5px', marginLeft: '0px', marginRight: '0px'}}
    },
    {
      strategy: DescriptionStrategy.ALWAYS_VISIBLE,
      style: {margin: {marginTop: '0px', marginBottom: '5px', marginLeft: '0px', marginRight: '0px'}}
    },
    {
      strategy: DescriptionStrategy.ALWAYS_VISIBLE,
      style: {bgColor: 'rbga(0,0,0,.5)', textColor: 'white'}
    },
    {
      strategy: DescriptionStrategy.ALWAYS_VISIBLE,
      style: {bgColor: 'rbga(255,0,0,.5)', margin: {marginBottom: '0px'}}
    },
    {strategy: DescriptionStrategy.ALWAYS_VISIBLE, style: {}},
    {strategy: DescriptionStrategy.ALWAYS_VISIBLE, style: {margin: {}}},
    {strategy: DescriptionStrategy.ALWAYS_VISIBLE, style: null},
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
      bareElement = fixture.debugElement.query(By.css('figcaption:not(ksDescription)'));
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
        if (val && val.style) {
          expect(des[index].styles.background).toBe(val.style.bgColor);
          expect(des[index].styles.color).toBe(val.style.textColor);

          if (val.style.margin) {
            expect(des[index].nativeElement.style.marginTop).toBe(val.style.margin.marginTop ? val.style.margin.marginTop : '0px');
            expect(des[index].nativeElement.style.marginBottom).toBe(val.style.margin.marginBottom ? val.style.margin.marginBottom : '0px');
            expect(des[index].nativeElement.style.marginLeft).toBe(val.style.margin.marginLeft ? val.style.margin.marginLeft : '0px');
            expect(des[index].nativeElement.style.marginRight).toBe(val.style.margin.marginRight ? val.style.margin.marginRight : '0px');
          }
        }
      });
    });

    it('should check expected results for bare <figcaption> without this directive', () => {
      expect(bareElement.properties['ksDescription']).toBeUndefined();
    });
  });
});
