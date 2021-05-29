import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BLEPageRoutingModule } from './ble-routing.module';

import { BLEPage } from './ble.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BLEPageRoutingModule
  ],
  declarations: [BLEPage]
})
export class BLEPageModule {}
