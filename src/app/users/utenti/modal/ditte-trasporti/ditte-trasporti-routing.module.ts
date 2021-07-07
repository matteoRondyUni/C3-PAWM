import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DitteTrasportiPage } from './ditte-trasporti.page';

const routes: Routes = [
  {
    path: '',
    component: DitteTrasportiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DitteTrasportiPageRoutingModule {}
