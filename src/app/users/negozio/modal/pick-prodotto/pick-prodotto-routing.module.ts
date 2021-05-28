import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PickProdottoPage } from './pick-prodotto.page';

const routes: Routes = [
  {
    path: '',
    component: PickProdottoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PickProdottoPageRoutingModule {}
