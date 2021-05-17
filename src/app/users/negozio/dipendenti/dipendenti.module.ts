import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DipendentiPageRoutingModule } from './dipendenti-routing.module';

import { DipendentiPage } from './dipendenti.page';
import { DettagliDipendentePageModule } from '../modal/dettagli-dipendente/dettagli-dipendente.module';
import { CreaCommerciantiPageModule } from '../modal/crea-commercianti/crea-commercianti.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DipendentiPageRoutingModule,
    DettagliDipendentePageModule,
    CreaCommerciantiPageModule
  ],
  declarations: [DipendentiPage]
})
export class DipendentiPageModule {}
