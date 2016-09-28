import { NgModule }       from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import {ImageModal} from '../directives/angular2-image-popup/image-modal-popup';

@NgModule({
    declarations: [AppComponent,ImageModal],
    imports:      [BrowserModule],
    bootstrap:    [AppComponent],
})
export class AppModule {}
