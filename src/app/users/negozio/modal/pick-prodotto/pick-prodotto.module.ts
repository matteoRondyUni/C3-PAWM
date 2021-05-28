import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PickProdottoPageRoutingModule } from './pick-prodotto-routing.module';

import { PickProdottoPage } from './pick-prodotto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PickProdottoPageRoutingModule
  ],
  declarations: [PickProdottoPage]
})
export class PickProdottoPageModule {}
