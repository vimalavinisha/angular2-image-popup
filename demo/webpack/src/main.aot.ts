import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';
import { AppModuleNgFactory } from '../aot/src/app/app.module.ngfactory';
import { decorateModuleRef } from './environment';

if (webpack.ENV === 'production') {
  enableProdMode();
}

export function main(): Promise<any> {
  return platformBrowser()
    .bootstrapModuleFactory(AppModuleNgFactory)
    .then(decorateModuleRef)
    .catch((err: any) => console.error(err));
}

export function bootstrapDomReady(): any {
  document.addEventListener('DOMContentLoaded', main);
}

bootstrapDomReady();