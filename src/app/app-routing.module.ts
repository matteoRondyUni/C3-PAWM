import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'login-utente',
    loadChildren: () => import('./auth/login/login-utente/login-utente.module').then(m => m.LoginUtentePageModule)
  },
  {
    path: 'login-attivita',
    loadChildren: () => import('./auth/login/login-attivita/login-attivita.module').then(m => m.LoginAttivitaPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./auth/registration/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'register-cliente',
    loadChildren: () => import('./auth/registration/register-cliente/register-cliente.module').then(m => m.RegisterClientePageModule)
  },
  {
    path: 'register-attivita',
    loadChildren: () => import('./auth/registration/register-attivita/register-attivita.module').then(m => m.RegisterAttivitaPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then(m => m.AboutPageModule)
  },
  {
    path: 'cliente',
    loadChildren: () => import('./users/cliente/menu/menu.module').then(m => m.MenuPageModule),
    //  TODO
    // canLoad: [AuthGuard]
  },
  {
    path: 'negozio',
    loadChildren: () => import('./users/negozio/menu/menu.module').then(m => m.MenuPageModule)
    //TODO: mettere il guard per l'attività
  },
  {
    path: 'commerciante',
    loadChildren: () => import('./users/commerciante/menu/menu.module').then(m => m.MenuPageModule)
  },
  {
    path: 'corriere',
    loadChildren: () => import('./users/corriere/menu/menu.module').then(m => m.MenuPageModule)
  }
];



@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
