import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../../services/authentication-service/authentication.service';
import { ErrorManagerService } from '../../../../services/error-manager/error-manager.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { AlertManagerService } from 'src/app/services/alert-manager/alert-manager.service';

@Component({
  selector: 'app-crea-dipendente',
  templateUrl: './crea-dipendente.page.html',
  styleUrls: ['./crea-dipendente.page.scss'],
})
export class CreaDipendentePage implements OnInit {
  credenziali: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertManager: AlertManagerService,
    private errorManager: ErrorManagerService,
    private loadingController: LoadingController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.credenziali = this.fb.group({
      nome: ['', [Validators.required]],
      cognome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)],],
      telefono: ['', [Validators.required]],
      indirizzo: ['', [Validators.required]],
    });
  }

  async closeModal() {
    this.modalController.dismiss();
  }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();

    (await this.authService.registerDipendente(this.credenziali.value)).subscribe(
      async (res) => {
        await loading.dismiss();
        this.modalController.dismiss(true);
        this.alertManager.createInfoAlert('Nuovo dipendente creato', 'Ora è stato aggiunto alla lista');
      },
      async (res) => {
        await loading.dismiss();
        this.modalController.dismiss(false);
        this.errorManager.stampaErrore(res, 'Creazione dipendente fallita');
      });
  }
}
