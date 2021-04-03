import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuClientePage } from './menu-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: MenuClientePage,
    redirectTo: 'home-cliente',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('../../../auth/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'home-cliente',
    component: MenuClientePage,
    loadChildren: () => import('../home-cliente/home-cliente.module').then(m => m.HomeClientePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuClientePageRoutingModule { }
