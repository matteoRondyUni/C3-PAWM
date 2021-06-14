import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AggiungiCorrierePage } from './aggiungi-corriere.page';

const routes: Routes = [
  {
    path: '',
    component: AggiungiCorrierePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AggiungiCorrierePageRoutingModule {}
