import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
import { ComponentsModule } from '../../../components/components.module';
import { InventarioStatsModule } from '../../../components/home/inventario-stats/inventario-stats.component.module';
import { VenditeStatsModule } from '../../../components/home/vendite-stats/vendite-stats.component.module';
import { MagazziniStatsModule } from '../../../components/home/magazzini-stats/magazzini-stats.component.module';
import { MagazziniPageModule } from '../../utenti/modal/magazzini/magazzini.module'
import { DitteTrasportiStatsModule } from '../../../components/home/ditte-trasporti-stats/ditte-trasporti-stats.component.module';
import { DitteTrasportiPageModule } from '../../utenti/modal/ditte-trasporti/ditte-trasporti.module'
import { NegoziStatsModule } from '../../../components/home/negozi-stats/negozi-stats.component.module';
import { NegoziPageModule } from '../../utenti/modal/negozi/negozi.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ComponentsModule,
    InventarioStatsModule,
    VenditeStatsModule,
    MagazziniStatsModule,
    MagazziniPageModule,
    DitteTrasportiStatsModule,
    DitteTrasportiPageModule,
    NegoziStatsModule,
    NegoziPageModule
  ],
  declarations: [HomePage]
})
export class HomePageModule { }
