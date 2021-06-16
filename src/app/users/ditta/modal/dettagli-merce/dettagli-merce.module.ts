import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DettagliMercePageRoutingModule } from './dettagli-merce-routing.module';

import { DettagliMercePage } from './dettagli-merce.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DettagliMercePageRoutingModule
  ],
  declarations: [DettagliMercePage]
})
export class DettagliMercePageModule {}
