import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreaCommerciantiPage } from './crea-commercianti.page';

const routes: Routes = [
  {
    path: '',
    component: CreaCommerciantiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreaCommerciantiPageRoutingModule {}
