import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  isLoginPage() {
    document.getElementById("header-login").style.color = "white";
    document.getElementById("header-login").style.backgroundColor = "#2196F3";
    document.getElementById("header-login-label").style.color = "white";
    document.getElementById("header-login-label").style.backgroundColor = "#2196F3";
  }

}
