import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NegoziPageRoutingModule } from './negozi-routing.module';

import { NegoziPage } from './negozi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NegoziPageRoutingModule
  ],
  declarations: [NegoziPage]
})
export class NegoziPageModule {}
