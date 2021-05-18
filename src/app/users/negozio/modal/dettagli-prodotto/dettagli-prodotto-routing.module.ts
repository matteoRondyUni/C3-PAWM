import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DettagliProdottoPage } from './dettagli-prodotto.page';

const routes: Routes = [
  {
    path: '',
    component: DettagliProdottoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DettagliProdottoPageRoutingModule {}
