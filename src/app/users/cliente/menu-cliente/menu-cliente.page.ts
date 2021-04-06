import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-menu-cliente',
  templateUrl: './menu-cliente.page.html',
  styleUrls: ['./menu-cliente.page.scss'],
})
export class MenuClientePage implements OnInit {

  pages = [
    {
      title: 'Home',
      icon: 'home-outline',
      url: '/cliente/home'
    },
    {
      title: 'Promozioni',
      icon: 'pricetags-outline',
      url: '/cliente/promo'
    }
  ]

  selectedPath = '';

  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.selectedPath = event.url;
    });
  }

  ngOnInit() {
  }

}
