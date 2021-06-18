import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ErrorManagerService } from 'src/app/services/error-manager.service';
import { AggiungiCorrierePage } from '../modal/aggiungi-corriere/aggiungi-corriere.page';
import { DettagliMercePage } from '../modal/dettagli-merce/dettagli-merce.page';

@Component({
  selector: 'app-spedizioni',
  templateUrl: './spedizioni.page.html',
  styleUrls: ['./spedizioni.page.scss'],
})
export class SpedizioniPage implements OnInit {
  public segment: string = "consegnare";
  ordini = [];
  ordiniDaConsegnare = [];
  ordiniCompletati = [];

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private errorManager: ErrorManagerService,
    private modalController: ModalController) {
    this.loadOrdini();
  }

  ngOnInit() {
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }

  async loadOrdini() {
    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };

    this.ordini = [];
    this.ordiniDaConsegnare = [];
    this.ordiniCompletati = [];

    this.http.get('/ordini', { headers }).subscribe(
      async (res) => {
        this.ordini = res['results'];
        this.loadProdotti(this.ordini, token_value);
      },
      async (res) => {
        this.errorManager.stampaErrore(res, 'Errore');
      });
  }

  loadProdotti(ordini, token_value) {
    ordini.forEach(ordine => {
      const headers = { 'token': token_value };
      this.http.get('/merci/' + ordine.id, { headers }).subscribe(
        async (res) => {
          var prodotti = res['results'];
          ordine[prodotti];
          ordine.prodotti = prodotti;
          this.dividiListaOridini();
        },
        async (res) => {
          this.errorManager.stampaErrore(res, 'Errore');
        });
    });
  }

  dividiListaOridini() {
    this.ordini.forEach(ordine => {
      var daConsegnare = false;

      if (ordine.prodotti != undefined && ordine.prodotti != null)
        for (let i = 0; i < ordine.prodotti.length; i++)
          if (ordine.prodotti[i].id_corriere == null) daConsegnare = true;

      if (daConsegnare) {
        if (!this.ordiniDaConsegnare.includes(ordine))
          this.ordiniDaConsegnare = [...this.ordiniDaConsegnare, ordine];
      } else
        if (!this.ordiniCompletati.includes(ordine))
          this.ordiniCompletati = [...this.ordiniCompletati, ordine];
    })
  }

  async aggiungiCorriere(prodotto) {
    const modal = await this.modalController.create({
      component: AggiungiCorrierePage,
      componentProps: {
        id: prodotto.id,
        id_ordine: prodotto.id_ordine,
        id_corriere: prodotto.id_corriere,
        nome: prodotto.nome,
        prezzo_acquisto: prodotto.prezzo_acquisto,
        quantita: prodotto.quantita,
        stato: prodotto.stato,
      },
      cssClass: 'fullheight'
    });

    modal.onDidDismiss().then((data) => {
      const corriereAggiunto = data['data'];

      if (corriereAggiunto) {
        this.loadOrdini();
      }
    });

    return await modal.present();
  }

  async apriDettagli(prodotto) {
    const modal = await this.modalController.create({
      component: DettagliMercePage,
      componentProps: {
        id: prodotto.id,
        id_ordine: prodotto.id_ordine,
        id_corriere: prodotto.id_corriere,
        nome: prodotto.nome,
        prezzo_acquisto: prodotto.prezzo_acquisto,
        quantita: prodotto.quantita,
        stato: prodotto.stato,
      },
      cssClass: 'fullheight'
    });

    return await modal.present();
  }

}