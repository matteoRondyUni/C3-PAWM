import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreaProdottoPageRoutingModule } from './crea-prodotto-routing.module';

import { CreaProdottoPage } from './crea-prodotto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CreaProdottoPageRoutingModule
  ],
  declarations: [CreaProdottoPage]
})
export class CreaProdottoPageModule {}
