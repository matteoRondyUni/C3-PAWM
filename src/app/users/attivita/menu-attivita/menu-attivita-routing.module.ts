import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuAttivitaPage } from './menu-attivita.page';

const routes: Routes = [
  {
    path: '',
    component: MenuAttivitaPage,
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: MenuAttivitaPage,
    loadChildren: () => import('../home-attivita/home-attivita.module').then(m => m.HomeAttivitaPageModule)
  },
  {
    path: 'dipendenti',
    component: MenuAttivitaPage,
    loadChildren: () => import('../dipendenti/dipendenti.module').then( m => m.DipendentiPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuAttivitaPageRoutingModule { }
