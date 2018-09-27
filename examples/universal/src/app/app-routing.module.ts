import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ModalGalleryComponent } from './modal-gallery/modal-gallery.component';
import { PlainGalleryComponent } from './plain-gallery/plain-gallery.component';
import { CarouselComponent } from './carousel/carousel.component';

const routes: Routes = [
  { path: '', component: CarouselComponent },
  { path: 'carousel', component: CarouselComponent },
  { path: 'modal', component: ModalGalleryComponent },
  { path: 'plain', component: PlainGalleryComponent },
  { path: 'lazy', loadChildren: './lazy/lazy.module#LazyModule' },
  { path: 'lazy/nested', loadChildren: './lazy/lazy.module#LazyModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
