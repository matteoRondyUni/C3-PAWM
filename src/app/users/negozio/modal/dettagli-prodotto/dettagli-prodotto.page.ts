import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavParams } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ErrorManagerService } from 'src/app/services/error-manager.service';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dettagli-prodotto',
  templateUrl: './dettagli-prodotto.page.html',
  styleUrls: ['./dettagli-prodotto.page.scss'],
})
export class DettagliProdottoPage implements OnInit {
  dati: FormGroup;

  @Input() id_prodotto: any;
  @Input() nome: any;
  @Input() quantita: any;
  @Input() prezzo: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthenticationService,
    private errorManager: ErrorManagerService,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    this.id_prodotto = this.navParams.get('id_prodotto');
    this.nome = this.navParams.get('nome');
    this.quantita = this.navParams.get('quantita');
    this.prezzo = this.navParams.get('prezzo');
    this.dati = this.fb.group({
      nome: [this.nome, [Validators.required]],
      quantita: [this.quantita, [Validators.required]],
      prezzo: [this.prezzo, [Validators.required]]
    });
  }

  async closeModal() {
    this.modalController.dismiss();
  }

  async eliminaProdotto() {
    const loading = await this.loadingController.create();
    await loading.present();

    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };

    this.http.delete('/prodotto/' + this.id_prodotto, { headers }).pipe(
      map((data: any) => data.esito),
      switchMap(esito => { return esito; })).subscribe(
        async (res) => {
          const text = 'Il prodotto ' + this.nome + ' è stato eliminato';
          await loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Prodotto eliminato',
            message: text,
            buttons: ['OK'],
          });
          this.modalController.dismiss(true);
          await alert.present();
        },
        async (res) => {
          await loading.dismiss();
          this.modalController.dismiss(false);
          this.errorManager.stampaErrore(res, 'Eliminazione Fallita');
        });
  }

  async modificaProdotto() {
    const loading = await this.loadingController.create();
    await loading.present();

    const token_value = (await this.authService.getToken()).value;
    const to_send = {
      'nome': this.dati.value.nome,
      'quantita': this.dati.value.quantita,
      'prezzo': this.dati.value.prezzo,
      'token_value': token_value
    }

    this.http.put('/prodotto/' + this.id_prodotto, to_send).pipe(
      map((data: any) => data.esito),
      switchMap(esito => { return esito; })).subscribe(
        async (res) => {
          const text = 'I dati del prodotto sono stati aggiornati';
          await loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Prodotto modificato',
            message: text,
            buttons: ['OK'],
          });
          this.modalController.dismiss(true);
          await alert.present();
        },
        async (res) => {
          await loading.dismiss();
          this.modalController.dismiss(false);
          this.errorManager.stampaErrore(res, 'Modifica Fallita');
        });
  }

}
