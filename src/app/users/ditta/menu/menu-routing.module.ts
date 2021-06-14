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
    path: 'dipendenti',
    component: MenuPage,
    loadChildren: () => import('../../attivita/dipendenti/dipendenti.module').then(m => m.DipendentiPageModule)
  },
  {
    path: 'spedizioni',
    component: MenuPage,
    loadChildren: () => import('../spedizioni/spedizioni.module').then(m => m.SpedizioniPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule { }
