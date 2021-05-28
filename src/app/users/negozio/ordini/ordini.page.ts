import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { AuthenticationService } from '../../../services/authentication.service';
import { map, switchMap } from 'rxjs/operators';
import { PickDittaPage } from '../modal/pick-ditta/pick-ditta.page';
import { PickMagazzinoPage } from '../modal/pick-magazzino/pick-magazzino.page';
import { PickProdottoPage } from '../modal/pick-prodotto/pick-prodotto.page';

@Component({
  selector: 'app-ordini',
  templateUrl: './ordini.page.html',
  styleUrls: ['./ordini.page.scss'],
})
export class OrdiniPage implements OnInit {
  ordine: FormGroup;
  magazzino = { "id": null, "ragione_sociale": null, "indirizzo": null };
  ditta = { "id": null, "ragione_sociale": null, "indirizzo": null };
  prodotti = [];
  consegnaADomicilio: boolean;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private modalController: ModalController,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.ordine = this.fb.group({
      email: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
    });
  }

  async pickMagazzini() {
    const modal = await this.modalController.create({
      component: PickMagazzinoPage,
      cssClass: 'fullheight'
    });

    modal.onDidDismiss().then((data) => {
      const magazzinoSelezionato = data['data'];
      if (magazzinoSelezionato != null) this.magazzino = magazzinoSelezionato;
    });

    return await modal.present();
  }

  async pickDitta() {
    const modal = await this.modalController.create({
      component: PickDittaPage,
      cssClass: 'fullheight'
    });

    modal.onDidDismiss().then((data) => {
      const dittaSelezionata = data['data'];
      if (dittaSelezionata != null) this.ditta = dittaSelezionata;
    });

    return await modal.present();
  }

  async scegliProdotto() {
    const modal = await this.modalController.create({
      component: PickProdottoPage,
      cssClass: 'fullheight'
    });

    modal.onDidDismiss().then((data) => {
      const prodottoSelezionato = data['data'];
      if (prodottoSelezionato != null) {
        this.prodotti.push(prodottoSelezionato);
      }
      console.log(this.prodotti);
    });

    return await modal.present();
  }

  //TODO controllare dati da inviare
  async creaOrdine() {
    const loading = await this.loadingController.create();
    await loading.present();

    const token_value = (await this.authService.getToken()).value;

    const to_send = {
      'id_magazzino': this.magazzino.id,
      'email_cliente': this.ordine.value.email,
      'id_ditta': this.ditta.id,
      'tipo': this.ordine.value.tipo,
      'token_value': token_value,
      'prodotti': this.prodotti
    }

    this.http.post('/ordine', to_send).pipe(
      map((data: any) => data.esito),
      switchMap(esito => { return esito; })).subscribe(
        async (res) => {
          await loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Nuovo ordine creato',
            message: "Ora è stato aggiunto allo storico",
            buttons: ['OK'],
          });
          await alert.present();
        },
        async (res) => {
          await loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Creazione ordine fallita',
            message: res.error,
            buttons: ['OK'],
          });
          await alert.present();
        });
  }

  changeForm(event) {
    var choice = event.target.value;
    if (choice == "DOMICILIO") {
      this.magazzino = { "id": null, "ragione_sociale": null, "indirizzo": null };
      this.ditta = { "id": null, "ragione_sociale": null, "indirizzo": null };
      this.consegnaADomicilio = true;
    }
    if (choice == "MAGAZZINO") {
      this.consegnaADomicilio = false;
    }
  }

  stampaArray() {
    console.log("prodotti:", this.prodotti);
  }

  modificaQuantita(prodotto, event) {
    var quantita = parseInt(event.target.value);
    this.prodotti.forEach(element => {
      console.log(element.id);
      if (element.id == prodotto.id) {
        element[quantita];
        element.quantita = quantita
      }
    });
  }


}