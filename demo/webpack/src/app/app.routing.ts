import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFound404Component } from "./pages/404/not-found404.component";

export const ROUTES: Routes = [
  {path: '',                                component: HomeComponent},
  {path: 'home',                            component: HomeComponent},
  {path: 'lazy',                            loadChildren: './pages/lazy#LazyModule'},
  {path: '**',                              component: NotFound404Component}
];