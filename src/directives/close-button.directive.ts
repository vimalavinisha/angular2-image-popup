import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ButtonsConfig } from '../components/modal-gallery';

@Directive({
  selector: '[close-button]'
})
export class CloseButtonDirective implements OnChanges {

  @Input() configButtons: ButtonsConfig;

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    // apply [style.right]="" to download url <a></a>
    this.el.nativeElement.style.right = `0px`;

    // hide closeButton if configButtons.close is false
    this.el.nativeElement.hidden = this.configButtons && !this.configButtons.close;
  }
}