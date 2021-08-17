import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from '../../../services/authentication-service/authentication.service';
import { ErrorManagerService } from '../../../services/error-manager/error-manager.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AlertManagerService } from 'src/app/services/alert-manager/alert-manager.service';

@Component({
  selector: 'app-login-attivita',
  templateUrl: './login-attivita.page.html',
  styleUrls: ['../../auth.scss'],
})
export class LoginAttivitaPage implements OnInit {
  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private errorManager: ErrorManagerService,
    private alertManager: AlertManagerService,
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

    this.authService.loginAttivita(this.credentials.value).subscribe(
      async (res) => {
        await loading.dismiss();

        switch (res) {
          case "1":
            this.router.navigateByUrl('/negozio', { replaceUrl: true });
            break;
          case "2":
            this.router.navigateByUrl('/magazzino', { replaceUrl: true });
            break;
          case "3":
            this.router.navigateByUrl('/trasporti', { replaceUrl: true });
            break;
          default:
            this.alertManager.createInfoAlert('Login fallito', 'Rieffettua il Login')
        }
      },
      async (res) => {
        await loading.dismiss();
        this.errorManager.stampaErrore(res, 'Login Failed');
      }
    );
  }
}
