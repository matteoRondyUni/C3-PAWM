import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpedizioniPageRoutingModule } from './spedizioni-routing.module';

import { SpedizioniPage } from './spedizioni.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpedizioniPageRoutingModule
  ],
  declarations: [SpedizioniPage]
})
export class SpedizioniPageModule {}
