import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lazy-view',
  template: `<h3>Useless page. This is only a demo page to test lazy loading with universal</h3>`
})
export class LazyComponent {}

@NgModule({
  declarations: [LazyComponent],
  imports: [RouterModule.forChild([{ path: '', component: LazyComponent, pathMatch: 'full' }])]
})
export class LazyModule {}
