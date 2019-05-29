import { OverlayRef } from '@angular/cdk/overlay';

import { Subject } from 'rxjs';

export class ModalOverlayRef {
  private action = new Subject<any>();
  action$ = this.action.asObservable();

  constructor(private overlayRef: OverlayRef) {}

  close(): void {
    this.overlayRef.dispose();
  }

  callAction(data: any): void {
    this.action.next(data);
  }
}
