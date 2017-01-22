import { NgModule }       from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import { ModalGalleryModule } from 'angular-modal-gallery';

@NgModule({
    declarations: [AppComponent],
    imports:      [BrowserModule, ModalGalleryModule.forRoot(),],
    bootstrap:    [AppComponent],
})
export class AppModule {}
