import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[ksScrollStop]'
})
export class ScrollStopDirective {

  @Input() enable: boolean;

  constructor(private renderer: Renderer2, private el: ElementRef) {
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    // if (!this.enable) {
    //   return;
    // }
    // TODO not working
    // event.stopPropagation();
    // event.stopImmediatePropagation();
    // event.preventDefault();
  }
}
