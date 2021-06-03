import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpedizioniPage } from './spedizioni.page';

const routes: Routes = [
  {
    path: '',
    component: SpedizioniPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpedizioniPageRoutingModule {}
