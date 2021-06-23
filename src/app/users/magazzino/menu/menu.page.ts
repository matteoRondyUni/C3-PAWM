import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';

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
      url: '/magazzino/home'
    },
    {
      title: 'Dipendenti',
      icon: 'people-outline',
      url: '/magazzino/dipendenti'
    },
    {
      title: 'Ordini',
      icon: 'cart-outline',
      url: '/magazzino/ordini'
    },
    {
      title: 'Impostazioni',
      icon: 'settings-outline',
      url: '/magazzino/impostazioni'
    }
  ];

  selectedPath = '';

  constructor(private authService: AuthenticationService, private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event.url != undefined) {
        if (event.url == '/magazzino') {
          this.selectedPath = '/magazzino/home';
        } else if (event.url == '/magazzino/ordini/cronologia') {
          this.selectedPath = '/magazzino/ordini';
        } else {
          this.selectedPath = event.url;
        }
      }
    });
  }

  ngOnInit() {
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}