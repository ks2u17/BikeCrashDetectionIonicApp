import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BLEPage } from './ble.page';

const routes: Routes = [
  {
    path: '',
    component: BLEPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BLEPageRoutingModule {}
