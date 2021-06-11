import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { AuthenticationService } from '../../../services/authentication.service';
import { ErrorManagerService } from '../../../services/error-manager.service';
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
  public segment: string = "crea";
  ordine: FormGroup;
  magazzino = { "id": null, "ragione_sociale": null, "indirizzo": null };
  ditta = { "id": null, "ragione_sociale": null, "indirizzo": null };
  consegnaADomicilio: boolean;
  prodotti = [];
  ordini = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthenticationService,
    private errorManager: ErrorManagerService,
    private alertController: AlertController,
    private modalController: ModalController,
    private loadingController: LoadingController,
  ) {
    this.loadOrdini()
  }

  ngOnInit() {
    this.ordine = this.fb.group({
      email: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
    });
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
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
      componentProps: {
        prodotti_inseriti: this.prodotti
      },
      cssClass: 'fullheight'
    });

    modal.onDidDismiss().then((data) => {
      const prodottoSelezionato = data['data'];
      if (prodottoSelezionato != null) {
        var quantita;
        prodottoSelezionato[quantita];
        prodottoSelezionato.quantita = 1
        this.prodotti = [...this.prodotti, prodottoSelezionato];
      }
      console.log(this.prodotti);
    });

    return await modal.present();
  }

  rimuoviProdotto(prodotto) {
    const index = this.prodotti.indexOf(prodotto, 0);
    if (index > -1) this.prodotti.splice(index, 1);
    this.prodotti = [...this.prodotti];
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
          this.loadOrdini();
        },
        async (res) => {
          await loading.dismiss();
          this.errorManager.stampaErrore(res, 'Creazione ordine fallita');
        });
  }

  async loadOrdini() {
    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };

    this.http.get('/ordini', { headers }).subscribe(
      async (res) => {
        this.ordini = res['results'];
        this.loadMerci(this.ordini, token_value);
      },
      async (res) => {
        this.errorManager.stampaErrore(res, 'Errore');
      });
  }

  loadMerci(ordini, token_value) {
    ordini.forEach(ordine => {
      const headers = { 'token': token_value };
      this.http.get('/merci/' + ordine.id, { headers }).subscribe(
        async (res) => {
          var merci = res['results'];
          ordine[merci];
          ordine.merci = merci;
        },
        async (res) => {
          this.errorManager.stampaErrore(res, 'Errore');
        });
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

  modificaQuantita(prodotto, event) {
    var quantita = parseInt(event.target.value);
    this.prodotti.forEach(element => {
      console.log(element.id);
      if (element.id == prodotto.id) {
        element.quantita = quantita
      }
    });
  }
}