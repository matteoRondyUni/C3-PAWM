import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from '../../../services/authentication-service/authentication.service';
import { ErrorManagerService } from '../../../services/error-manager/error-manager.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AlertManagerService } from 'src/app/services/alert-manager/alert-manager.service';


@Component({
  selector: 'app-register-cliente',
  templateUrl: './register-cliente.page.html',
  styleUrls: ['../../auth.scss'],
})
export class RegisterClientePage implements OnInit {
  credenziali: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private errorManager: ErrorManagerService,
    private router: Router,
    private alertManager: AlertManagerService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.credenziali = this.fb.group({
      nome: ['', [Validators.required]],
      cognome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      telefono: ['', [Validators.required]],
      indirizzo: ['', [Validators.required]],
    });
  }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.registerCliente(this.credenziali.value).subscribe(
      async (res) => {
        await loading.dismiss();
        this.router.navigateByUrl('/login', { replaceUrl: true });
        this.alertManager.createInfoAlert('Registrazione completata', 'Ora puoi effettuare il login');
      },
      async (res) => {
        await loading.dismiss();
        this.errorManager.stampaErrore(res, 'Registrazione fallita');
      }
    );
  }
}
