import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private router : Router) { }

  ngOnInit() {
  }

  apriLoginUtente(){
    this.router.navigateByUrl('/login-utente', { replaceUrl: true });
  }

  apriLoginAttivita(){
    this.router.navigateByUrl('/login-attivita', { replaceUrl: true });
  }
}
