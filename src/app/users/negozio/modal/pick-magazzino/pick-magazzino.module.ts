import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PickMagazzinoPageRoutingModule } from './pick-magazzino-routing.module';

import { PickMagazzinoPage } from './pick-magazzino.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PickMagazzinoPageRoutingModule
  ],
  declarations: [PickMagazzinoPage]
})
export class PickMagazzinoPageModule {}
