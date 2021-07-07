import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MagazziniPageRoutingModule } from './magazzini-routing.module';

import { MagazziniPage } from './magazzini.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MagazziniPageRoutingModule
  ],
  declarations: [MagazziniPage]
})
export class MagazziniPageModule {}
