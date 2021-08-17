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
  @Input() disponibilita: any;
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
    this.disponibilita = this.navParams.get('disponibilita');
    this.prezzo = this.navParams.get('prezzo');
    this.dati = this.fb.group({
      nome: [this.nome, [Validators.required]],
      disponibilita: [this.disponibilita, [Validators.required]],
      prezzo: [this.prezzo, [Validators.required]]
    });
  }

  async closeModal() {
    this.modalController.dismiss();
  }

  async modificaStatoProdotto() {
    const loading = await this.loadingController.create();
    await loading.present();

    const token_value = (await this.authService.getToken()).value;
    const to_send = { 'token_value': token_value };

    this.http.put('/prodotto/disponibilita/' + this.id_prodotto, to_send).subscribe(
      async (res) => {
        const text = 'Il prodotto ' + this.nome + ' è stato tolto dal Catalogo.';
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Prodotto Fuori Catalogo',
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

  async modificaProdotto() {
    const loading = await this.loadingController.create();
    await loading.present();

    const token_value = (await this.authService.getToken()).value;
    const to_send = {
      'nome': this.dati.value.nome,
      'disponibilita': this.dati.value.disponibilita,
      'prezzo': this.dati.value.prezzo,
      'token_value': token_value
    }

    this.http.put('/prodotto/' + this.id_prodotto, to_send).subscribe(
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
