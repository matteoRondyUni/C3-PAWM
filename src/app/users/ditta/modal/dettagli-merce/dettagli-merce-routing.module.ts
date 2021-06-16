import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DettagliMercePage } from './dettagli-merce.page';

const routes: Routes = [
  {
    path: '',
    component: DettagliMercePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DettagliMercePageRoutingModule {}
