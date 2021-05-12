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
    path: 'login-cliente',
    loadChildren: () => import('./auth/login/login-cliente/login-cliente.module').then(m => m.LoginClientePageModule)
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
    path: 'cliente',
    loadChildren: () => import('./users/cliente/menu-cliente/menu-cliente.module').then(m => m.MenuClientePageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then(m => m.AboutPageModule)
  },
  {
    path: 'attivita',
    loadChildren: () => import('./users/attivita/menu-attivita/menu-attivita.module').then( m => m.MenuAttivitaPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
