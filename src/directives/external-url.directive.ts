import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ButtonsConfig } from '../components/modal-gallery';

@Directive({
  selector: '[exturl-button]'
})
export class ExternalUrlButtonDirective implements OnChanges {

  @Input() configButtons: ButtonsConfig;
  @Input() imgExtUrl: string | void;

  private RIGHT: number = 63;

  constructor(private el: ElementRef) { }

  ngOnChanges(changes: SimpleChanges) {
    let right: number = 0;
    if (this.configButtons && this.configButtons.extUrl && this.imgExtUrl) {
      right = this.getNumOfPrecedingButtons() * this.RIGHT;
    } else {
      right = 0;
    }

    // apply [style.right]="" to external url <a></a>
    this.el.nativeElement.style.right = `${right}px`;

    // hide externalUrlButton based on this condition
    // configButtons && !configButtons.extUrl OR imgExtUrl is not valid (for instance is null)
    this.el.nativeElement.hidden = (this.configButtons && !this.configButtons.extUrl) || !this.imgExtUrl;
  }

  private getNumOfPrecedingButtons() {
    let num: number = 0;
    if(!this.configButtons) {
      return num;
    }

    if(this.configButtons.close) {
      num++;
    }

    return num;
  }

}