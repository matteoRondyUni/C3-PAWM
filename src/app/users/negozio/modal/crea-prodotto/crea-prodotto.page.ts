import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../../services/authentication-service/authentication.service';
import { ErrorManagerService } from '../../../../services/error-manager/error-manager.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertManagerService } from 'src/app/services/alert-manager/alert-manager.service';

@Component({
  selector: 'app-crea-prodotto',
  templateUrl: './crea-prodotto.page.html',
  styleUrls: ['./crea-prodotto.page.scss'],
})
export class CreaProdottoPage implements OnInit {
  dati: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthenticationService,
    private errorManager: ErrorManagerService,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private alertManager: AlertManagerService
  ) { }

  ngOnInit() {
    this.dati = this.fb.group({
      nome: ['', [Validators.required]],
      disponibilita: ['', [Validators.required]],
      prezzo: ['', [Validators.required]]
    });
  }

  async closeModal() {
    this.modalController.dismiss();
  }

  async creaProdotto() {
    const loading = await this.loadingController.create();
    await loading.present();

    const token_value = (await this.authService.getToken()).value;

    const to_send = {
      'nome': this.dati.value.nome,
      'disponibilita': this.dati.value.disponibilita,
      'prezzo': this.dati.value.prezzo,
      'token_value': token_value
    }

    this.http.post('/prodotto', to_send).subscribe(
      async (res) => {
        await loading.dismiss();
        this.modalController.dismiss(true);
        this.alertManager.createInfoAlert('Nuovo prodotto creato', "Ora è stato aggiunto alla lista");
      },
      async (res) => {
        await loading.dismiss();
        this.modalController.dismiss(false);
        this.errorManager.stampaErrore(res, 'Creazione prodotto fallita');
      });
    this.modalController.dismiss(true);
  }
}
