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
      url: '/negozio/home'
    },
    {
      title: 'Dipendenti',
      icon: 'people-outline',
      url: '/negozio/dipendenti'
    },
    {
      title: 'Inventario',
      icon: 'file-tray-stacked-outline',
      url: '/negozio/inventario'
    }
  ]

  selectedPath = '';

  constructor(private authService: AuthenticationService, private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event.url != undefined) {
        if (event.url == '/negozio') {
          this.selectedPath = '/negozio/home';
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
