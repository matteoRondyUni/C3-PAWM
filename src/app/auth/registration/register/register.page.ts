import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  
  constructor(private router : Router) { }

  ngOnInit() {
  }

  apriRegisterUtente(){
    this.router.navigateByUrl('/register-cliente', { replaceUrl: true });
  }

  apriRegisterAttivita(){
    this.router.navigateByUrl('/register-attivita', { replaceUrl: true });
  }
}
