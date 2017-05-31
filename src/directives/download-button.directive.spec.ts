import { Component, DebugElement } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DownloadButtonDirective } from './download-button.directive';
import { By } from '@angular/platform-browser';
import { ComponentFixture } from '@angular/core/testing';

@Component({
  template: `<a download-button [configButtons]="{download: true, extUrl: true}" [imgExtUrl]="'exturl'">Link</a>`
})
class TestComponent {}

let fixture: ComponentFixture<TestComponent>;
let des: DebugElement[];

beforeEach(() => {
  fixture = TestBed.configureTestingModule({
    declarations: [DownloadButtonDirective, TestComponent]
  })
    .createComponent(TestComponent);
  fixture.detectChanges(); // initial binding
  // all elements with an attached DownloadButtonDirective
  des = fixture.debugElement.queryAll(By.directive(DownloadButtonDirective));
  // // the h2 without the DownloadButtonDirective
  // bareH2 = fixture.debugElement.query(By.css('h2:not([highlight])'));
});

// color tests
it('should have three highlighted elements', () => {
  expect(des).not.toBeNull();
});
