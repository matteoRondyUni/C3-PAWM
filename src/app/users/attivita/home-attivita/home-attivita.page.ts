import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-attivita',
  templateUrl: './home-attivita.page.html',
  styleUrls: ['./home-attivita.page.scss'],
})
export class HomeAttivitaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
}
