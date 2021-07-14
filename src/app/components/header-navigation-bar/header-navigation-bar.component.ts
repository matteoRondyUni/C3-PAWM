import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-header-navigation-bar',
  templateUrl: './header-navigation-bar.component.html',
  styleUrls: ['./header-navigation-bar.component.scss'],
})
export class HeaderNavigationBarComponent implements OnInit {
  selectedPath = '';

  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event.url != undefined) {
        if (event.url == '/')
          this.selectedPath = '/home';
        else if (event.url == '/login-utente' || event.url == '/login-attivita')
          this.selectedPath = '/login';
        else if (event.url == '/register-cliente' || event.url == '/register-attivita')
          this.selectedPath = '/register';
        else
          this.selectedPath = event.url;
      }
    });
  }

  ngOnInit() { }

  apriHome() {
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }

  apriLogin() {
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  apriRegistrazione() {
    this.router.navigateByUrl('/register', { replaceUrl: true });
  }

  apriAbout() {
    this.router.navigateByUrl('/about', { replaceUrl: true });
  }
}
