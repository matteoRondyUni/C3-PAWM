import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-utente-routing.module';

import { ComponentsModule } from '../../../components/components.module';

import { LoginUtentePage } from './login-utente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    LoginPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [LoginUtentePage]
})
export class LoginUtentePageModule { }
