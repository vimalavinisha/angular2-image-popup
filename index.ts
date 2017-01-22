/**
 * @module
 * @description
 * Entry point for all public APIs of the async local storage package.
 */
import {NgModule, ModuleWithProviders} from "@angular/core";
import {AngularModalGalleryModule} from "./src/angular-modal-gallery_module";
export { AngularModalGalleryModule } from './src/angular-modal-gallery_module';

import './styles/main.css'
import './styles/style.css'

@NgModule({
  imports: [
    AngularModalGalleryModule.forRoot()
  ],
  exports: [AngularModalGalleryModule]
})
export class AngulaRootModalGalleryModule {
}


@NgModule({imports: [AngularModalGalleryModule], exports: [AngularModalGalleryModule]})
export class ModalGalleryModule {
  static forRoot(): ModuleWithProviders { return {ngModule: AngulaRootModalGalleryModule}; }
}