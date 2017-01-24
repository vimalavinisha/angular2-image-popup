import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const ROUTES: Routes = [
  {path: '',                                component: HomeComponent},
  {path: 'home',                            component: HomeComponent},
  {path: 'lazy',                            loadChildren: './pages/lazy#LazyModule'}
];