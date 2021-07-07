import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NegoziPage } from './negozi.page';

const routes: Routes = [
  {
    path: '',
    component: NegoziPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NegoziPageRoutingModule {}
