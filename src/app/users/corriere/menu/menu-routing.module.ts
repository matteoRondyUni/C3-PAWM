import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/corriere/home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MenuPage,
    children: [
      { path: 'home', loadChildren: () => import('../home/home.module').then(m => m.HomePageModule) },
      { path: 'merci', loadChildren: () => import('../merci/merci.module').then(m => m.MerciPageModule) },
      { path: 'impostazioni', loadChildren: () => import('../../utenti/impostazioni/impostazioni.module').then(m => m.ImpostazioniPageModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule { }
