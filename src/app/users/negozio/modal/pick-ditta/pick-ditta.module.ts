import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PickDittaPageRoutingModule } from './pick-ditta-routing.module';

import { PickDittaPage } from './pick-ditta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PickDittaPageRoutingModule
  ],
  declarations: [PickDittaPage]
})
export class PickDittaPageModule {}
