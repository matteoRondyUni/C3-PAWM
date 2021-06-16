import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpedizioniPageRoutingModule } from './spedizioni-routing.module';

import { SpedizioniPage } from './spedizioni.page';

import { AggiungiCorrierePageModule } from '../modal/aggiungi-corriere/aggiungi-corriere.module';
import { DettagliMercePageModule } from '../modal/dettagli-merce/dettagli-merce.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpedizioniPageRoutingModule,
    AggiungiCorrierePageModule,
    DettagliMercePageModule
  ],
  declarations: [SpedizioniPage]
})
export class SpedizioniPageModule { }
