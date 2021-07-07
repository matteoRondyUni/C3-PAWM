import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DitteTrasportiPageRoutingModule } from './ditte-trasporti-routing.module';

import { DitteTrasportiPage } from './ditte-trasporti.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DitteTrasportiPageRoutingModule
  ],
  declarations: [DitteTrasportiPage]
})
export class DitteTrasportiPageModule {}
