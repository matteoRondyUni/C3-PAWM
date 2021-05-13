import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeAttivitaPage } from './home-attivita.page';

const routes: Routes = [
  {
    path: '',
    component: HomeAttivitaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeAttivitaPageRoutingModule {}
