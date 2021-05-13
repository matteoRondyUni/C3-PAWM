import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-menu-attivita',
  templateUrl: './menu-attivita.page.html',
  styleUrls: ['./menu-attivita.page.scss'],
})
export class MenuAttivitaPage implements OnInit {

  pages = [
    {
      title: 'Home',
      icon: 'home-outline',
      url: '/attivita/home'
    },
    {
      title: 'Dipendenti',
      icon: 'people-outline',
      url: '/attivita/dipendenti'
    }
  ]

  selectedPath = '';

  constructor(private authService: AuthenticationService, private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event.url != undefined) {
        if (event.url == '/attivita') {
          this.selectedPath = '/attivita/home';
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
