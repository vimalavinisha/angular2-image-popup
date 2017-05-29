import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[click-outside]'
})
export class ClickOutsideDirective {

  @Output() clickOutside: EventEmitter<boolean> = new EventEmitter<boolean>();

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: Element) {
    let elementId: string = targetElement.id;

    if(elementId === 'ng-gallery-content') {
      this.clickOutside.emit(true);
    }
  }
}