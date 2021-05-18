import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DipendentiPage } from './dipendenti.page';

const routes: Routes = [
  {
    path: '',
    component: DipendentiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DipendentiPageRoutingModule {}
