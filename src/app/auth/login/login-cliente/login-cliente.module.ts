import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-cliente-routing.module';

import { ComponentsModule } from '../../../components/components.module';

import { LoginClientePage } from './login-cliente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    LoginPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [LoginClientePage]
})
export class LoginClientePageModule { }
