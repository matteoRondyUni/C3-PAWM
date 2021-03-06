import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  pages = [
    {
      title: 'Home',
      icon: 'home-outline',
      url: '/trasporti/home'
    },
    {
      title: 'Dipendenti',
      icon: 'people-outline',
      url: '/trasporti/dipendenti'
    },
    {
      title: 'Spedizioni',
      icon: 'pricetags-outline',
      url: '/trasporti/spedizioni'
    },
    {
      title: 'Impostazioni',
      icon: 'settings-outline',
      url: '/trasporti/impostazioni'
    }
  ]

  constructor(private authService: AuthenticationService, private router: Router) {  }

  ngOnInit() {
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
