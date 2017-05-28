import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ButtonsConfig } from '../components/modal-gallery';

@Directive({
  selector: '[download-button]'
})
export class DownloadButtonDirective implements OnChanges {

  @Input() configButtons: ButtonsConfig;
  @Input() imgExtUrl: string | void;

  private RIGHT: number = 63;

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    let right: number = 0;
    if (this.configButtons && this.configButtons.download) {
      right = this.getNumOfPrecedingButtons() * this.RIGHT;
    } else {
      right = 0;
    }
    // apply [style.right]="" to download url <a></a>
    this.el.nativeElement.style.right = `${right}px`;

    // hide downloadButton if configButtons.download is false
    this.el.nativeElement.hidden = this.configButtons && !this.configButtons.download;
  }

  private getNumOfPrecedingButtons() {
    let num: number = 0;
    if(!this.configButtons) {
      return num;
    }

    if(this.configButtons.extUrl && this.imgExtUrl) {
      num++;
    }

    if(this.configButtons.close) {
      num++;
    }

    return num;
  }
}