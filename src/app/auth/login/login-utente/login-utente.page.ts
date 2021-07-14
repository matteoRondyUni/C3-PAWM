import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from '../../../services/authentication.service';
import { ErrorManagerService } from '../../../services/error-manager.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login-utente',
  templateUrl: './login-utente.page.html',
  styleUrls: ['./login-utente.page.scss'],
})
export class LoginUtentePage implements OnInit {
  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private errorManager: ErrorManagerService,
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

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.loginUser(this.credentials.value).subscribe(
      async (res) => {
        console.log("res: ", res);
        console.log("primo metodo: ", (await this.authService.getToken()).value);
        await loading.dismiss();

        switch (res) {
          case "1":
            this.router.navigateByUrl('/cliente', { replaceUrl: true });
            break;
          case "2":
            this.router.navigateByUrl('/commerciante', { replaceUrl: true });
            break;
          case "3":
            this.router.navigateByUrl('/corriere', { replaceUrl: true });
            break;
          case "4":
            this.router.navigateByUrl('/magazziniere', { replaceUrl: true });
            break;
          default:
            const alert = await this.alertController.create({
              header: 'Login failed',
              message: "Rieffettua il Login",
              buttons: ['OK'],
            });
            await alert.present();
        }
      },
      async (res) => {
        await loading.dismiss();
        this.errorManager.stampaErrore(res, 'Login Failed');
      }
    );
  }
}