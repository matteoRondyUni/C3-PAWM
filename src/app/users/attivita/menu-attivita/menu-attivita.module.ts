import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuAttivitaPageRoutingModule } from './menu-attivita-routing.module';

import { MenuAttivitaPage } from './menu-attivita.page';

import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    MenuAttivitaPageRoutingModule
  ],
  declarations: [MenuAttivitaPage]
})
export class MenuAttivitaPageModule { }
