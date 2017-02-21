import {Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[externalUrlButton]'
})
export class ExternalUrlButtonDirective implements OnInit {

  @Input('externalUrlButton') showExtUrlButton: boolean;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    // apply [style.right]="" to external url <a></a>
    this.el.nativeElement.style.right = this.showExtUrlButton ? '63px' : '0px';
  }
}