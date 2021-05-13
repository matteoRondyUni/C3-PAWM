import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PromozioniPage } from './promozioni.page';

const routes: Routes = [
  {
    path: '',
    component: PromozioniPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromozioniPageRoutingModule {}
