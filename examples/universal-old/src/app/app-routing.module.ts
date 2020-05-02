import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { ModalGalleryComponent } from './modal-gallery/modal-gallery.component';
import { PlainGalleryComponent } from './plain-gallery/plain-gallery.component';
import { CarouselComponent } from './carousel/carousel.component';
import { CarouselIe11Component } from './carousel-ie11/carousel-ie11.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'carousel', component: CarouselComponent },
  { path: 'carousel-ie11', component: CarouselIe11Component },
  { path: 'modal', component: ModalGalleryComponent },
  { path: 'plain', component: PlainGalleryComponent },
  { path: 'lazy', loadChildren: () => import('./lazy/lazy.module').then(m => m.LazyModule) },
  { path: 'lazy/nested', loadChildren: () => import('./lazy/lazy.module').then(m => m.LazyModule) }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: Boolean(history.pushState) === false,
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
