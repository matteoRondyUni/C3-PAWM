import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DipendentiPageRoutingModule } from './dipendenti-routing.module';

import { DipendentiPage } from './dipendenti.page';
import { DettagliDipendentePageModule } from '../modal/dettagli-dipendente/dettagli-dipendente.module';
import { CreaDipendentePageModule } from '../modal/crea-dipendente/crea-dipendente.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DipendentiPageRoutingModule,
    DettagliDipendentePageModule,
    CreaDipendentePageModule
  ],
  declarations: [DipendentiPage]
})
export class DipendentiPageModule {}
