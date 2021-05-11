import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginAttivitaPageRoutingModule } from './login-attivita-routing.module';

import { ComponentsModule } from '../../../components/components.module';

import { LoginAttivitaPage } from './login-attivita.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    LoginAttivitaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [LoginAttivitaPage]
})
export class LoginAttivitaPageModule { }
