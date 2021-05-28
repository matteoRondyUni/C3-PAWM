import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../../services/authentication.service';
import { ErrorManagerService } from '../../../../services/error-manager.service';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, switchMap } from 'rxjs/operators';

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
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.dati = this.fb.group({
      nome: ['', [Validators.required]],
      quantita: ['', [Validators.required]],
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
      'quantita': this.dati.value.quantita,
      'prezzo': this.dati.value.prezzo,
      'token_value': token_value
    }

    this.http.post('/prodotto', to_send).pipe(
      map((data: any) => data.esito),
      switchMap(esito => { return esito; })).subscribe(
        async (res) => {
          await loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Nuovo prodotto creato',
            message: "Ora è stato aggiunto alla lista",
            buttons: ['OK'],
          });
          this.modalController.dismiss(true);
          await alert.present();
        },
        async (res) => {
          await loading.dismiss();
          this.modalController.dismiss(false);
          this.errorManager.stampaErrore(res, 'Creazione prodotto fallita');
        });
  }
}
