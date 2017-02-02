/*
 The MIT License (MIT)

 Copyright (c) 2017 Stefano Cappa (Ks89)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ROUTES }  from './app.routing';

// Third party opensource libraries (that are using scss/css)
import 'bootstrap-loader';
import 'font-awesome/css/font-awesome.css';
import '../loading.css'; // css to show a centered spinner before angular's booting


// ********************** angular-modal-gallery *****************************
import 'hammerjs'; // Mandatory for angular-modal-gallery 3.x.x or greater (`npm i --save hammerjs @types/hammerjs`)

import { ModalGalleryModule } from 'angular-modal-gallery'; // <----------------- angular-modal-gallery library import
// **************************************************************************


import { ApplicationComponent } from './application/application.component';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './common/components/navbar/navbar.component';

import { removeNgStyles, createNewHosts, createInputTransfer } from "@angularclass/hmr";
import { IdlePreloadModule } from "@angularclass/idle-preload";
import { RouterModule, PreloadAllModules } from "@angular/router";

@NgModule({
  imports: [
    IdlePreloadModule.forRoot(), // forRoot ensures the providers are only created once
    BrowserModule,
    RouterModule.forRoot(ROUTES, { useHash: false, preloadingStrategy: PreloadAllModules }),

    ModalGalleryModule.forRoot() // <-------------------------------------------- angular-modal-gallery module import
],
  declarations: [
    ApplicationComponent,
    HomeComponent,
    NavbarComponent
  ],
  providers: [],
  bootstrap: [ ApplicationComponent ]
})

export class AppModule {

  // ----------- Hot Module Replacement via AngularClass library - BEGIN ------------
  constructor(public appRef: ApplicationRef) {}
  hmrOnInit(store: any): any {
    if (!store || !store.state) return;
    console.log('HMR store', store);
    console.log('store.state.data:', store.state.data);
    // inject AppStore here and update it
    // this.AppStore.update(store.state)
    if ('restoreInputValues' in store) {
      store.restoreInputValues();
    }
    // change detection
    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }
  hmrOnDestroy(store: any): any {
    var cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // inject your AppStore and grab state then set it on store
    // var appState = this.AppStore.get()
    store.state = {data: 'example value'};
    // store.state = Object.assign({}, appState)
    // save input values
    store.restoreInputValues  = createInputTransfer();
    // remove styles
    removeNgStyles();
  }
  hmrAfterDestroy(store: any): any {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
    // anything you need done the component is removed
  }
  // ----------- Hot Module Replacement via AngularClass library - END ------------
}