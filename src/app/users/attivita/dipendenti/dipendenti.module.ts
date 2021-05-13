import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DipendentiPageRoutingModule } from './dipendenti-routing.module';

import { DipendentiPage } from './dipendenti.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DipendentiPageRoutingModule
  ],
  declarations: [DipendentiPage]
})
export class DipendentiPageModule {}
