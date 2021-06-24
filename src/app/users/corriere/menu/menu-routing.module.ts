import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: MenuPage,
    loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'merci',
    component: MenuPage,
    loadChildren: () => import('../merci/merci.module').then(m => m.MerciPageModule)
  },
  {
    path: 'impostazioni',
    component: MenuPage,
    loadChildren: () => import('../../utenti/impostazioni/impostazioni.module').then(m => m.ImpostazioniPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule { }
