import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { GalleryModule } from '@ks89/angular-modal-gallery'; // <----------------- angular-modal-gallery library import

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [AppModule, ServerModule, GalleryModule],
  bootstrap: [AppComponent]
})
export class AppServerModule {}
