import { Directive, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[ksDirection]'
})
export class DirectionDirective implements OnInit, OnChanges {
  @Input() direction: string;
  @Input() justify: string;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    this.applyStyle();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.applyStyle();
  }

  private applyStyle() {
    if (!this.direction || !this.justify) {
      return;
    }
    this.renderer.setStyle(this.el.nativeElement, 'flex-direction', this.direction);
    this.renderer.setStyle(this.el.nativeElement, 'justify-content', this.justify);
  }
}
