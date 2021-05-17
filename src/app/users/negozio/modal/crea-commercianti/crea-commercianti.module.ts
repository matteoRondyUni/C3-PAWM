import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreaCommerciantiPageRoutingModule } from './crea-commercianti-routing.module';

import { CreaCommerciantiPage } from './crea-commercianti.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CreaCommerciantiPageRoutingModule
  ],
  declarations: [CreaCommerciantiPage]
})
export class CreaCommerciantiPageModule {}
