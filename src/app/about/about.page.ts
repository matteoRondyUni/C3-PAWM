import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

  isAboutPage() {
    document.getElementById("header-about").style.color = "white";
    document.getElementById("header-about").style.backgroundColor = "#2196F3";
    document.getElementById("header-about-label").style.color = "white";
    document.getElementById("header-about-label").style.backgroundColor = "#2196F3";
  }

}
