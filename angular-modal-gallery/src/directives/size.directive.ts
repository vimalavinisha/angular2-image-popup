import { Directive, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';

export interface Size {
  width: number;
  height: number;
  unitWidth: string;
  unitHeight: string;
}

@Directive({
  selector: '[ksSize]'
})
export class SizeDirective implements OnInit, OnChanges {

  @Input() sizeConfig: Size;

  constructor(private renderer: Renderer2, private el: ElementRef) {
  }

  ngOnInit() {
    this.applyStyle();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.applyStyle();
  }

  private applyStyle() {
    // apply [style.width]
    this.renderer.setStyle(this.el.nativeElement, 'width', `${this.sizeConfig.width}${this.sizeConfig.unitWidth}`);
    this.renderer.setStyle(this.el.nativeElement, 'height', `${this.sizeConfig.height}${this.sizeConfig.unitHeight}`);
  }
}
