import { OverlayRef } from '@angular/cdk/overlay';

import { Subject } from 'rxjs';
import { ImageModalEvent } from '../../model/image.class';
import { InteractionEvent } from '../../model/interaction-event.interface';
import { ButtonEvent } from '../../model/buttons-config.interface';

export class ModalGalleryRef {
  private close = new Subject<any>();
  close$ = this.close.asObservable();
  private show = new Subject<any>();
  show$ = this.show.asObservable();
  private firstImage = new Subject<any>();
  firstImage$ = this.firstImage.asObservable();
  private lastImage = new Subject<any>();
  lastImage$ = this.lastImage.asObservable();
  private hasData = new Subject<any>();
  hasData$ = this.hasData.asObservable();
  private buttonBeforeHook = new Subject<any>();
  buttonBeforeHook$ = this.buttonBeforeHook.asObservable();
  private buttonAfterHook = new Subject<any>();
  buttonAfterHook$ = this.buttonAfterHook.asObservable();

  constructor(private overlayRef: OverlayRef) {}

  closeModal(): void {
    this.overlayRef.dispose();
  }

  emitClose(event: ImageModalEvent) {
    this.close.next(event);
  }
  emitShow(event: ImageModalEvent) {
    this.show.next(event);
  }
  emitFirstImage(event: ImageModalEvent) {
    this.firstImage.next(event);
  }
  emitLastImage(event: ImageModalEvent) {
    this.lastImage.next(event);
  }
  emitHasData(event: ImageModalEvent) {
    this.hasData.next(event);
  }
  emitButtonBeforeHook(event: ButtonEvent) {
    this.buttonBeforeHook.next(event);
  }
  emitButtonAfterHook(event: ButtonEvent) {
    this.buttonAfterHook.next(event);
  }
}
