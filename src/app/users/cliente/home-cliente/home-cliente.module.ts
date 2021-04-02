import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { HomeClientePageRoutingModule } from './home-cliente-routing.module';

import { HomeClientePage } from './home-cliente.page';
import { ComponentsModule } from '../../../components/components.module';
import { MenuClienteModule } from '../menu-cliente/menu-cliente.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    MenuClienteModule,
    HomeClientePageRoutingModule
  ],
  declarations: [HomeClientePage]
})
export class HomeClientePageModule { }
