import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { DipendentiStatsModule } from 'src/app/components/home/dipendenti-stats/dipendenti-stats.component.module';
import { DitteTrasportiStatsModule } from 'src/app/components/home/ditte-trasporti-stats/ditte-trasporti-stats.component.module';
import { DitteTrasportiPageModule } from '../../utenti/modal/ditte-trasporti/ditte-trasporti.module';
import { MagazziniStatsModule } from 'src/app/components/home/magazzini-stats/magazzini-stats.component.module';
import { MagazziniPageModule } from '../../utenti/modal/magazzini/magazzini.module';
import { NegoziPageModule } from '../../utenti/modal/negozi/negozi.module';
import { NegoziStatsModule } from 'src/app/components/home/negozi-stats/negozi-stats.component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    DipendentiStatsModule,
    MagazziniStatsModule,
    MagazziniPageModule,
    DitteTrasportiStatsModule,
    DitteTrasportiPageModule,
    NegoziStatsModule,
    NegoziPageModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
