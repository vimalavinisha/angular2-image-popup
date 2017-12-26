import { Directive, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[ksWrap]'
})
export class WrapDirective implements OnInit, OnChanges {
  @Input() wrap: boolean;
  @Input() width: string;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    this.applyStyle();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.applyStyle();
  }

  private applyStyle() {
    if (!this.wrap) {
      return;
    }
    this.renderer.setStyle(this.el.nativeElement, 'width', this.width);
    this.renderer.setStyle(this.el.nativeElement, 'flex-wrap', this.wrap ? 'wrap' : 'nowrap');
  }
}
