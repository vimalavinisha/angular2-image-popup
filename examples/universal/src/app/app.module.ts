import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TransferHttpCacheModule } from '@nguniversal/common';

// ********************** angular-modal-gallery *****************************
import { GalleryModule } from '@ks89/angular-modal-gallery'; // <----------------- angular-modal-gallery library import
// **************************************************************************

// ************************ optional font-awesome 5 ************************
// to install use both `npm i --save @fortawesome/fontawesome` and `npm i --save @fortawesome/fontawesome-free-solid`
import { faDownload, faExternalLinkAlt, faPlus, faTimes } from '@fortawesome/fontawesome-free-solid';
import * as fontawesome from '@fortawesome/fontawesome';
fontawesome.library.add(faExternalLinkAlt, faPlus, faTimes, faDownload);
// *************************************************************************

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'my-app' }),
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'lazy', loadChildren: './lazy/lazy.module#LazyModule' },
      { path: 'lazy/nested', loadChildren: './lazy/lazy.module#LazyModule' }
    ]),
    TransferHttpCacheModule,

    GalleryModule.forRoot() // <-------------------------------------------- angular-modal-gallery module import
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
