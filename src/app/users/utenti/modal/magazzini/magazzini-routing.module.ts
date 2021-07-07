import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MagazziniPage } from './magazzini.page';

const routes: Routes = [
  {
    path: '',
    component: MagazziniPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MagazziniPageRoutingModule {}
