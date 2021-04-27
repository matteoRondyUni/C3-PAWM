import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterAttivitaPageRoutingModule } from './register-attivita-routing.module';
import { ComponentsModule } from '../../../components/components.module';

import { RegisterAttivitaPage } from './register-attivita.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RegisterAttivitaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RegisterAttivitaPage]
})
export class RegisterAttivitaPageModule { }
