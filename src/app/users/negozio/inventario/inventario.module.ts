import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventarioPageRoutingModule } from './inventario-routing.module';

import { InventarioPage } from './inventario.page';
import { DettagliProdottoPageModule } from '../modal/dettagli-prodotto/dettagli-prodotto.module';
import { CreaProdottoPageModule } from '../modal/crea-prodotto/crea-prodotto.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventarioPageRoutingModule,
    DettagliProdottoPageModule,
    CreaProdottoPageModule
  ],
  declarations: [InventarioPage]
})
export class InventarioPageModule { }
