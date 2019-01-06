import { Component, Inject, OnInit } from '@angular/core';
import { FILE_PREVIEW_DIALOG_DATA } from './file-preview-overlay.tokens';

@Component({
  selector: 'ks-app-overlaycontent',
  templateUrl: './overlaycontent.component.html',
  styleUrls: ['./overlaycontent.component.css']
})
export class OverlaycontentComponent implements OnInit {
  constructor(@Inject(FILE_PREVIEW_DIALOG_DATA) public image: any) {}

  ngOnInit() {}
}
