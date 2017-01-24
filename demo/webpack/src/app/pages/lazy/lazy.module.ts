import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from './lazy.routes';
import { LazyComponent } from './lazy.component';
import { ModalGalleryModule } from "../../../../../../index";

console.log('`Lazy` bundle loaded asynchronously');

@NgModule({
  declarations: [
    LazyComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ModalGalleryModule.forRoot(),
  ],
})
export class LazyModule {
  public static routes = routes;
}