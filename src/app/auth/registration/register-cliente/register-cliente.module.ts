import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterClientePageRoutingModule } from './register-cliente-routing.module';
import { ComponentsModule } from '../../../components/components.module';

import { RegisterClientePage } from './register-cliente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RegisterClientePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RegisterClientePage]
})
export class RegisterClientePageModule { }
