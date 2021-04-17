import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from './../../services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  isLoginPage() {
    document.getElementById("header-login").style.color = "white";
    document.getElementById("header-login").style.backgroundColor = "#2196F3";
    document.getElementById("header-login-label").style.color = "white";
    document.getElementById("header-login-label").style.backgroundColor = "#2196F3";
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();
    if (this.authService.login(this.credentials.value)) {
      await loading.dismiss();
      this.router.navigateByUrl('/cliente', { replaceUrl: true });
    } else {
      await loading.dismiss();
    }
  }
}