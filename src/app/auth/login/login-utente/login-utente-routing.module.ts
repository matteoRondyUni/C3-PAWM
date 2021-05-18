import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginUtentePage } from './login-utente.page';

const routes: Routes = [
  {
    path: '',
    component: LoginUtentePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
