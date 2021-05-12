import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from '../../../services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login-attivita',
  templateUrl: './login-attivita.page.html',
  styleUrls: ['./login-attivita.page.scss'],
})
export class LoginAttivitaPage implements OnInit {
  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
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

    this.authService.loginAttivita(this.credentials.value).subscribe(
      async (res) => {
        console.log("res: ", res);
        console.log("primo metodo: ", (await this.authService.getToken()).value);
        console.log("secondo metodo: ", this.authService.token);
        await loading.dismiss();
        //TODO cambiare /cliente con /attivita
        this.router.navigateByUrl('/cliente', { replaceUrl: true });
      },
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Login failed',
          message: res.error,
          buttons: ['OK'],
        });

        await alert.present();
      }
    );
  }
}
