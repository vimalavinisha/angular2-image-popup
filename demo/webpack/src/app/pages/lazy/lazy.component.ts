import { Component } from '@angular/core';

console.log('`Lazy` component loaded asynchronously');

@Component({
  selector: 'mmw-cv-page',
  templateUrl: 'lazy.html'
})
export class LazyComponent {
  public pageHeader: any;

  constructor() {
  }
}
