import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DettagliProdottoPageRoutingModule } from './dettagli-prodotto-routing.module';

import { DettagliProdottoPage } from './dettagli-prodotto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DettagliProdottoPageRoutingModule
  ],
  declarations: [DettagliProdottoPage]
})
export class DettagliProdottoPageModule {}
