import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularModalGallery } from './angular-modal-gallery';

@NgModule({
  imports: [CommonModule],
  declarations: [AngularModalGallery],
  exports: [AngularModalGallery]
})
export class AngularModalGalleryModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AngularModalGalleryModule,
      // providers: [
      //   {provide: MyService, useClass: MyService}
      // ]
    };
  }
}

