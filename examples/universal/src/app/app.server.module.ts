import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

// ********************** angular-modal-gallery *****************************
import { GalleryModule } from '@ks89/angular-modal-gallery'; // <----------------- angular-modal-gallery library import
// **************************************************************************

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,

    GalleryModule // <-------------------------------------------- @ks89/angular-modal-gallery module import
  ],
  bootstrap: [AppComponent]
})
export class AppServerModule {}
