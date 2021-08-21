import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication-service/authentication.service';

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
      url: '/corriere/home'
    },
    {
      title: 'Merci da consegnare',
      icon: 'file-tray-stacked-outline',
      url: '/corriere/merci'
    },
    {
      title: 'Impostazioni',
      icon: 'settings-outline',
      url: '/corriere/impostazioni'
    }
  ]

  constructor(
    private authService: AuthenticationService,
    private router: Router) { }

  ngOnInit() {
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
