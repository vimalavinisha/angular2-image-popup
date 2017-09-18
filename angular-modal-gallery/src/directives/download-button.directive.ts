import { Directive, ElementRef, Input, OnChanges, SimpleChanges, OnInit, Renderer2 } from '@angular/core';

import { ButtonsConfig } from '../interfaces/buttons-config.interface';

/**
 * Directive to display the download button.
 * To show this button, you must provide a ButtonsConfig object with 'download: true' as property.
 * All other configurations will hide this button.
 * Pay attention, because this directive is quite smart to choose button's order using the
 * correct right margin in pixels. To do that, it uses also imgExtUrl and configButtons.
 */
@Directive({
  selector: '[download-button]'
})
export class DownloadButtonDirective implements OnInit, OnChanges {

  @Input() configButtons: ButtonsConfig;
  @Input() imgExtUrl: string | void;

  private RIGHT: number = 63;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    this.applyStyle();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.applyStyle();
  }

  private applyStyle() {
    let right: number = 0;
    if (this.configButtons && this.configButtons.download) {
      right = this.getNumOfPrecedingButtons() * this.RIGHT;
    } else {
      right = 0;
    }
    // apply [style.right]="" to download url <a></a>
    this.renderer.setStyle(this.el.nativeElement, 'right', `${right}px`);


    // hide downloadButton if configButtons.download is false
    this.renderer.setProperty(this.el.nativeElement, 'hidden', !this.configButtons || (this.configButtons && !this.configButtons.download));
  }

  private getNumOfPrecedingButtons() {
    let num: number = 0;
    if (!this.configButtons) {
      return num;
    }

    if (this.configButtons.extUrl && this.imgExtUrl) {
      num++;
    }

    if (this.configButtons.close === undefined || this.configButtons.close === true) {
      num++;
    }

    return num;
  }
}
