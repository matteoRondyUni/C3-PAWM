import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';

import { InventarioStatsModule } from '../../../components/home/inventario-stats/inventario-stats.component.module';
import { DipendentiStatsModule } from '../../../components/home/dipendenti-stats/dipendenti-stats.component.module';
import { VenditeStatsModule } from '../../../components/home/vendite-stats/vendite-stats.component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    InventarioStatsModule,
    DipendentiStatsModule,
    VenditeStatsModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
