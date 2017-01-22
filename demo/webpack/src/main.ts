import { enableProdMode } from '@angular/core';
import { bootloader } from "@angularclass/hmr";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";
import { decorateModuleRef } from './environment';

if (webpack.ENV === 'prod') {
  enableProdMode();
}

// to be able to use Hot Module Replacement by AngularClass
export function main(): Promise<any> {
  return platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then(decorateModuleRef)
    .catch((err: any) => console.error(err));
}

// boot on document ready
// uses Hot Module Replacement by AngularClass
bootloader(main);