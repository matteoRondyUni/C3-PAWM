import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PromozioniClientePageRoutingModule } from './promozioni-cliente-routing.module';

import { PromozioniClientePage } from './promozioni-cliente.page';

import { ComponentsModule } from '../../../components/components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PromozioniClientePageRoutingModule,
    ComponentsModule
  ],
  declarations: [PromozioniClientePage]
})
export class PromozioniClientePageModule {}
