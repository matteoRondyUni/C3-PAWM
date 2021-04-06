import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuClientePage } from './menu-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: MenuClientePage,
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: MenuClientePage,
    loadChildren: () => import('../home-cliente/home-cliente.module').then(m => m.HomeClientePageModule)
  },
  {
    path: 'promo',
    component: MenuClientePage,
    loadChildren: () => import('../promozioni-cliente/promozioni-cliente.module').then(m => m.PromozioniClientePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuClientePageRoutingModule { }
