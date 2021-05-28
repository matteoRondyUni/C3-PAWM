import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PickDittaPage } from './pick-ditta.page';

const routes: Routes = [
  {
    path: '',
    component: PickDittaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PickDittaPageRoutingModule {}
