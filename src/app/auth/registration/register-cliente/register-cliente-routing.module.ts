import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterClientePage } from './register-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterClientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterClientePageRoutingModule {}
