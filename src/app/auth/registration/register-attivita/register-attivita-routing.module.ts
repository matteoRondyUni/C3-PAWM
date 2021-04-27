import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterAttivitaPage } from './register-attivita.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterAttivitaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterAttivitaPageRoutingModule {}
