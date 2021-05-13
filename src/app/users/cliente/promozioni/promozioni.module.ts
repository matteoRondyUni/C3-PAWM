import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PromozioniPageRoutingModule } from './promozioni-routing.module';

import { PromozioniPage } from './promozioni.page';

import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PromozioniPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PromozioniPage]
})
export class PromozioniPageModule { }
