import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeAttivitaPageRoutingModule } from './home-attivita-routing.module';

import { HomeAttivitaPage } from './home-attivita.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeAttivitaPageRoutingModule
  ],
  declarations: [HomeAttivitaPage]
})
export class HomeAttivitaPageModule {}
