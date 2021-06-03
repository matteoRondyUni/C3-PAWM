import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DettagliOrdinePage } from './dettagli-ordine.page';

const routes: Routes = [
  {
    path: '',
    component: DettagliOrdinePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DettagliOrdinePageRoutingModule {}
