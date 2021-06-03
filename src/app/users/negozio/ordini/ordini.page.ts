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
import { Router } from '@angular/router';

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
  prodotti = [];
  ordini = [
    {
      id: 3,
      data_ordine: '2021-05-27',
      stato: 'IN TRANSITO',
      tipo: 'DOMICILIO',
      merci: [
        {
          nome: 'Pizza',
          prezzo_acquisto: '6.50',
          quantita: 5,
          stato: 'PAGATO'
        },
        {
          nome: 'Burrito',
          prezzo_acquisto: '3.50',
          quantita: 50,
          stato: 'PAGATO'
        },
        {
          nome: 'Salame',
          prezzo_acquisto: '8.50',
          quantita: 1,
          stato: 'PAGATO'
        }
      ]
    },
    {
      id: 2,
      data_ordine: '2021-04-12',
      stato: 'CONSEGNATO',
      tipo: 'MAGAZZINO',
      merci: [
        {
          nome: 'Calzino',
          prezzo_acquisto: '0.50',
          quantita: 5,
          stato: 'PAGATO'
        },
        {
          nome: 'M60',
          prezzo_acquisto: '1103.50',
          quantita: 1,
          stato: 'PAGATO'
        },
        {
          nome: 'Cavo HDMI',
          prezzo_acquisto: '4.50',
          quantita: 3,
          stato: 'PAGATO'
        }
      ]
    },
    {
      id: 1,
      data_ordine: '2021-06-01',
      stato: 'PAGATO',
      tipo: 'DOMICILIO',
      merci: [
        {
          nome: 'Brasile',
          prezzo_acquisto: '2.50',
          quantita: 1,
          stato: 'PAGATO'
        },
        {
          nome: 'Ford Focus',
          prezzo_acquisto: '16500.50',
          quantita: 1,
          stato: 'PAGATO'
        },
        {
          nome: 'Lenticchia',
          prezzo_acquisto: '9.50',
          quantita: 25,
          stato: 'PAGATO'
        }
      ]
    }
  ];
  consegnaADomicilio: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private authService: AuthenticationService,
    private errorManager: ErrorManagerService,
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

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }

  apriCronologia() {
    this.router.navigateByUrl('/negozio/ordini/cronologia');
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
          this.errorManager.stampaErrore(res, 'Creazione ordine fallita');
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

  async apriDettagli(ordine) {
    //   const modal = await this.modalController.create({
    //     component: DettagliDipendentePage,
    //     componentProps: {
    //       id_dipendente: dipendente.id,
    //       nome: dipendente.nome,
    //       cognome: dipendente.cognome,
    //       email: dipendente.email,
    //       telefono: dipendente.telefono,
    //       indirizzo: dipendente.indirizzo,
    //     },
    //     cssClass: 'fullheight'
    //   });

    //   modal.onDidDismiss().then((data) => {
    //     const eliminato = data['data'];

    //     if (eliminato) {
    //       this.loadDipendenti();
    //     }
    //   });

    //   return await modal.present();
    }
  }