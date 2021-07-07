import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';

import { InfoUtenteModule } from 'src/app/components/info-utente/info-utente.component.module';
import { MagazziniStatsModule } from 'src/app/components/home/magazzini-stats/magazzini-stats.component.module';
import { MagazziniPageModule } from '../../utenti/modal/magazzini/magazzini.module';
import { DitteTrasportiStatsModule } from 'src/app/components/home/ditte-trasporti-stats/ditte-trasporti-stats.component.module';
import { DitteTrasportiPageModule } from '../../utenti/modal/ditte-trasporti/ditte-trasporti.module';
import { NegoziStatsModule } from 'src/app/components/home/negozi-stats/negozi-stats.component.module';
import { NegoziPageModule } from '../../utenti/modal/negozi/negozi.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    InfoUtenteModule,
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
