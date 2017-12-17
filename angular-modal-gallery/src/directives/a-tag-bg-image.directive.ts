import { Directive, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { Image } from '../interfaces/image.class';

@Directive({
  selector: '[ksATagBgImage]'
})
export class ATagBgImageDirective implements OnInit, OnChanges {

  @Input() image: Image;
  @Input() style: string;

  constructor(private renderer: Renderer2, private el: ElementRef) {
  }

  ngOnInit() {
    this.applyStyle();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.applyStyle();
  }

  private applyStyle() {
    if (!this.image || (!this.image.plain && !this.image.modal)) {
      return;
    }

    const imgPath: string = this.image.plain && this.image.plain.img ? this.image.plain.img : this.image.modal.img;
    this.renderer.setStyle(this.el.nativeElement, 'background', `url('${imgPath}') ${this.style}`);
  }
}
