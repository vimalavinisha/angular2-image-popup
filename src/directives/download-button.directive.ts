import {Directive, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[downloadButton]'
})
export class DownloadButtonDirective implements OnChanges {

  @Input('downloadButton') downloadButton: boolean;
  @Input() extUrlButton: boolean;
  @Input() imgExtUrl: string | null | undefined;

  constructor(private el: ElementRef) {
  }

  ngOnChanges(changes: SimpleChanges) {
    let style: string;
    // apply [style.right]="" to download url <a></a>
    if (this.downloadButton) {
      if (this.extUrlButton === true && this.imgExtUrl) {
        style = '126px';
      } else {
        style = '63px';
      }
    } else {
      style = '0px';
    }
    this.el.nativeElement.style.right = style;

    // hide downloadButton if the input property is false
    this.el.nativeElement.hidden = !this.downloadButton;
  }
}