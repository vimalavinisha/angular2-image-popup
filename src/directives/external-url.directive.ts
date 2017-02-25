import {Directive, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[externalUrlButton]'
})
export class ExternalUrlButtonDirective implements OnChanges {

  @Input('externalUrlButton') showExtUrlButton: boolean;
  @Input() imgExtUrl: string | null | undefined;

  constructor(private el: ElementRef) { }

  ngOnChanges(changes: SimpleChanges) {
    // apply [style.right]="" to external url <a></a>
    this.el.nativeElement.style.right = this.showExtUrlButton ? '63px' : '0px';

    // hide externalUrlButton based on this condition
    // showExtUrlButton === false OR imgExtUrl is not valid (for instance is null)
    this.el.nativeElement.hidden = !this.showExtUrlButton || !this.imgExtUrl;
  }
}