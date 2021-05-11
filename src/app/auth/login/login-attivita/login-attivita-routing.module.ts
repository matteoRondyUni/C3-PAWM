import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginAttivitaPage } from './login-attivita.page';

const routes: Routes = [
  {
    path: '',
    component: LoginAttivitaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginAttivitaPageRoutingModule {}
