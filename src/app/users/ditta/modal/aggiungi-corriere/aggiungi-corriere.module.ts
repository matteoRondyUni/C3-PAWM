import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AggiungiCorrierePageRoutingModule } from './aggiungi-corriere-routing.module';

import { AggiungiCorrierePage } from './aggiungi-corriere.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AggiungiCorrierePageRoutingModule
  ],
  declarations: [AggiungiCorrierePage]
})
export class AggiungiCorrierePageModule { }
