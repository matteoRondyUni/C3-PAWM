import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DettagliDipendentePage } from './dettagli-dipendente.page';

const routes: Routes = [
  {
    path: '',
    component: DettagliDipendentePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DettagliDipendentePageRoutingModule {}
