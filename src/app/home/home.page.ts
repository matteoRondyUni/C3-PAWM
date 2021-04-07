import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {}

  isHomePage() {
    document.getElementById("header-home").style.color = "white";
    document.getElementById("header-home").style.backgroundColor = "#2196F3";
    document.getElementById("header-home-label").style.color = "white";
    document.getElementById("header-home-label").style.backgroundColor = "#2196F3";
  }
}
