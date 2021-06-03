import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DettagliOrdinePageRoutingModule } from './dettagli-ordine-routing.module';

import { DettagliOrdinePage } from './dettagli-ordine.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DettagliOrdinePageRoutingModule
  ],
  declarations: [DettagliOrdinePage]
})
export class DettagliOrdinePageModule {}
