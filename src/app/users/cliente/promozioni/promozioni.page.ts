import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promozioni',
  templateUrl: './promozioni.page.html',
  styleUrls: ['./promozioni.page.scss'],
})
export class PromozioniPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
}
