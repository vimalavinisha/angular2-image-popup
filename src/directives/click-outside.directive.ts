import {Directive, ElementRef, Output, EventEmitter, HostListener} from '@angular/core';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {

  constructor(private el: ElementRef) { }

  @Output() clickOutside:EventEmitter<boolean> = new EventEmitter<boolean>();

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: any) {

    console.log("targetElement");
    console.log(targetElement);


    const clickedInside = this.el.nativeElement.contains(targetElement);

    console.log("clickedInside");
    console.log(clickedInside);

    if (!clickedInside) {
      this.clickOutside.emit(true);
    }
  }
}