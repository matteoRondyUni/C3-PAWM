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
    loadChildren: () => import('../../magazziniere/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'ordini',
    component: MenuPage,
    loadChildren: () => import('../../magazzino/ordini/ordini.module').then(m => m.OrdiniPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
