import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdiniPageRoutingModule } from './ordini-routing.module';

import { OrdiniPage } from './ordini.page';

import { PickDittaPageModule } from '../modal/pick-ditta/pick-ditta.module';
import { PickMagazzinoPageModule } from '../modal/pick-magazzino/pick-magazzino.module';
import { PickProdottoPageModule } from '../modal/pick-prodotto/pick-prodotto.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdiniPageRoutingModule,
    ReactiveFormsModule,
    PickDittaPageModule,
    PickMagazzinoPageModule,
    PickProdottoPageModule
  ],
  declarations: [OrdiniPage]
})
export class OrdiniPageModule { }
