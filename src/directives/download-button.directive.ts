import {Directive, ElementRef, Input, OnChanges} from '@angular/core';

@Directive({
  selector: '[downloadButton]'
})
export class DownloadButtonDirective implements OnChanges {

  @Input('downloadButton') downloadButton: boolean;
  @Input('extUrlButton') extUrlButton: boolean;
  @Input('imgExtUrl') imgExtUrl: string | null | undefined | void;

  constructor(private el: ElementRef) {
  }

  ngOnChanges() {
    let style: string;
    // apply [style.right]="" to download url <a></a>
    if (this.downloadButton) {
      if (this.extUrlButton === true && (this.imgExtUrl !== null && this.imgExtUrl !== undefined)) {
        style = '126px';
      } else {
        style = '63px';
      }
    } else {
      style = '0px';
    }
    this.el.nativeElement.style.right = style;
  }
}