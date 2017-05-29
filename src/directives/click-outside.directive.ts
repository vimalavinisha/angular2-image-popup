import {Directive, Output, EventEmitter, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[click-outside]'
})
export class ClickOutsideDirective {

  @Input() clickOutsideEnable: boolean;

  @Output() clickOutside: EventEmitter<boolean> = new EventEmitter<boolean>();

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: Element) {
    let elementId: string = targetElement.id;

    if(elementId === 'ng-gallery-content' && this.clickOutsideEnable) {
      this.clickOutside.emit(true);
    }
  }
}