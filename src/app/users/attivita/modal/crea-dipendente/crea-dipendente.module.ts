import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreaDipendentePageRoutingModule } from './crea-dipendente-routing.module';

import { CreaDipendentePage } from './crea-dipendente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CreaDipendentePageRoutingModule
  ],
  declarations: [CreaDipendentePage]
})
export class CreaDipendentePageModule {}
