import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DettagliDipendentePageRoutingModule } from './dettagli-dipendente-routing.module';

import { DettagliDipendentePage } from './dettagli-dipendente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DettagliDipendentePageRoutingModule
  ],
  declarations: [DettagliDipendentePage]
})
export class DettagliDipendentePageModule {}
