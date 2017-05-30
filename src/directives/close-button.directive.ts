import {Directive, Input, OnChanges, Renderer, ElementRef, SimpleChanges} from '@angular/core';
import { ButtonsConfig } from '../components/modal-gallery.component';

@Directive({
  selector: '[close-button]'
})
export class CloseButtonDirective implements OnChanges {

  @Input() configButtons: ButtonsConfig;

  constructor(private renderer: Renderer, private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    // apply [style.right]="" to download url <a></a>
    this.renderer.setElementStyle(this.el.nativeElement, 'right', '0px');

    // hide closeButton if configButtons.close is false
    this.renderer.setElementProperty(this.el.nativeElement, 'hidden', this.configButtons && !this.configButtons.close);
  }
}
