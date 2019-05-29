import { Component, Inject, OnInit } from '@angular/core';

import { ModalOverlayRef } from './modal-overlay-ref';
import { DIALOG_DATA } from './modal-overlay.tokens';
import { ModalOverlayService } from './modal-overlay.service';

@Component({
  selector: 'ks-app-overlaycontent',
  templateUrl: './overlaycontent.component.html',
  styleUrls: ['./overlaycontent.component.scss']
})
export class OverlaycontentComponent {
  image: any;
  dialogData: ModalOverlayService;

  constructor(private dialogRef: ModalOverlayRef, @Inject(DIALOG_DATA) private dialogContent: ModalOverlayService) {
    this.dialogData = dialogContent;
  }
}
