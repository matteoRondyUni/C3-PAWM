import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promozioni-cliente',
  templateUrl: './promozioni-cliente.page.html',
  styleUrls: ['./promozioni-cliente.page.scss'],
})
export class PromozioniClientePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
}
