import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavParams } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    this.closeModal();
    //TODO
    // const loading = await this.loadingController.create();
    // await loading.present();

    // const token_value = (await this.authService.getToken()).value;
    // const headers = { 'token': token_value };

    // this.http.delete('/dipendenti/' + this.id_dipendente, { headers }).pipe(
    //   map((data: any) => data.esito),
    //   switchMap(esito => { return esito; })).subscribe(
    //     async (res) => {
    //       const text = 'Il dipendente ' + this.nome + ' ' + this.cognome + ' è stato eliminato';
    //       await loading.dismiss();
    //       const alert = await this.alertController.create({
    //         header: 'Dipendente eliminato',
    //         message: text,
    //         buttons: ['OK'],
    //       });
    //       this.modalController.dismiss(true);
    //       await alert.present();
    //     },
    //     async (res) => {
    //       await loading.dismiss();
    //       const alert = await this.alertController.create({
    //         header: 'Eliminazione fallita',
    //         message: res.error,
    //         buttons: ['OK'],
    //       });
    //       this.modalController.dismiss(false);
    //       await alert.present();
    //     });
  }

  async modificaProdotto(){
    this.closeModal();
    //TODO
  }

}
