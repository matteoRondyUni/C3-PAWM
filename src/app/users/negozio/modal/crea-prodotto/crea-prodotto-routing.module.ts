import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreaProdottoPage } from './crea-prodotto.page';

const routes: Routes = [
  {
    path: '',
    component: CreaProdottoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreaProdottoPageRoutingModule {}
