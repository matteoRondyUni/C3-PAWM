import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/negozio/home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MenuPage,
    children: [
      { path: 'home', loadChildren: () => import('../home/home.module').then(m => m.HomePageModule) },
      { path: 'dipendenti', loadChildren: () => import('../../attivita/dipendenti/dipendenti.module').then(m => m.DipendentiPageModule) },
      { path: 'inventario', loadChildren: () => import('../inventario/inventario.module').then(m => m.InventarioPageModule) },
      { path: 'ordini', loadChildren: () => import('../ordini/ordini.module').then(m => m.OrdiniPageModule) },
      { path: 'impostazioni', loadChildren: () => import('../../attivita/impostazioni/impostazioni.module').then(m => m.ImpostazioniPageModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule { }
