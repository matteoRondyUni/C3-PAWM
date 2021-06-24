import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ImpostazioniPageRoutingModule } from './impostazioni-routing.module';

import { ImpostazioniPage } from './impostazioni.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ImpostazioniPageRoutingModule
  ],
  declarations: [ImpostazioniPage]
})
export class ImpostazioniPageModule {}
