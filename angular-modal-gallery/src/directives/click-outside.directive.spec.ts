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

import { Component, DebugElement, EventEmitter, Output } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ClickOutsideDirective } from './click-outside.directive';
import { By } from '@angular/platform-browser';
import { ComponentFixture } from '@angular/core/testing';

@Component({
  selector: 'test-click-outside',
  template: `
    <div class="ng-overlay">

      <div id="ng-gallery-content" class="ng-gallery-content"
           click-outside [clickOutsideEnable]="true"
           (clickOutside)="onClickOutside($event)">

        <div class="uil-ring-css">
          <div></div>
        </div>

        <a class="nav-left"><i class="fa fa-angle-left"></i></a>
        <img class="effect" src=""/>
        <a class="nav-right"><i class="fa fa-angle-right"></i></a>
        <span class="info-text"></span>
      </div>
    </div>
  `
})
class TestClickOutsideComponent {
  @Output() clicked: EventEmitter<boolean> = new EventEmitter<boolean>();
  onClickOutside(event: boolean) {
    console.log('clicked outside in comp');
    this.clicked.emit(event);
  }
}

let fixture: ComponentFixture<TestClickOutsideComponent>;
let comp: TestClickOutsideComponent;
let des: DebugElement[] = [];
let directive: ClickOutsideDirective;

describe('ClickOutsideDirective', () => {

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [TestClickOutsideComponent, ClickOutsideDirective]
    }); // not necessary with webpack .compileComponents();

    fixture = TestBed.createComponent(TestClickOutsideComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
    return fixture.whenStable().then(() => {
      fixture.detectChanges();
      des = fixture.debugElement.queryAll(By.directive(ClickOutsideDirective));
      directive = <ClickOutsideDirective>des[0].injector.get(ClickOutsideDirective);
    });
  });

  it('can instantiate it', () => expect(comp).not.toBeNull());

  describe('---tests---', () => {

    beforeEach(() => fixture.detectChanges());

    it('should have ${expected.length} close-button elements', () => {
      expect(des.length).toBe(1);
    });

    it(`should check expected results`, () => {
      directive.clickOutsideEnable = true;

      let clickOutsideDirective: DebugElement = fixture.debugElement.query(By.directive(ClickOutsideDirective));
      expect(clickOutsideDirective.name).toBe('div');
      expect(clickOutsideDirective.attributes['class']).toBe('ng-gallery-content');
      expect(clickOutsideDirective.attributes['click-outside']).toBe('');

      fixture.detectChanges();

      let overlay: DebugElement = fixture.debugElement.query(By.css('div#ng-gallery-content.ng-gallery-content'));
      comp.clicked.subscribe((res: boolean) => {
        expect(res).toBe(true);
      });
      overlay.nativeElement.click(); // for this scenario use the native click
    });
  });
});
