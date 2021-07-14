import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ErrorManagerService } from 'src/app/services/error-manager.service';
import { ReloadManagerService } from 'src/app/services/reload-manager.service';
import { AggiungiCorrierePage } from '../modal/aggiungi-corriere/aggiungi-corriere.page';
import { DettagliMercePage } from '../modal/dettagli-merce/dettagli-merce.page';

@Component({
  selector: 'app-spedizioni',
  templateUrl: './spedizioni.page.html',
  styleUrls: ['./spedizioni.page.scss'],
})
export class SpedizioniPage implements OnInit {
  segment: string = "consegnare";
  ordini = [];
  ordiniDaConsegnare = [];
  ordiniCompletati = [];

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private errorManager: ErrorManagerService,
    private reloadManager: ReloadManagerService,
    private modalController: ModalController) {
    this.loadOrdini(null);
  }

  ngOnInit() {
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }

  /**
   * Inizia il Reload.
   * @param event 
   */
  startReload(event) {
    this.loadOrdini(event)
  }

  async loadOrdini(event) {
    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };

    this.ordini = [];
    this.ordiniDaConsegnare = [];
    this.ordiniCompletati = [];

    this.http.get('/ordini', { headers }).subscribe(
      async (res) => {
        this.ordini = res['results'];
        this.loadMerci(this.ordini, token_value, event);
      },
      async (res) => {
        this.errorManager.stampaErrore(res, 'Errore');
        this.reloadManager.completaReload(event);
      });
  }

  async loadMerci(ordini, token_value, event) {
    await ordini.forEach(ordine => {
      const headers = { 'token': token_value };
      this.http.get('/merci/' + ordine.id, { headers }).subscribe(
        async (res) => {
          var merci = res['results'];
          ordine[merci];
          ordine.merci = merci;
          this.dividiListaOrdini();

          if (this.reloadManager.controlMerciOrdine(this.ordini))
            this.reloadManager.completaReload(event);
        },
        async (res) => {
          this.errorManager.stampaErrore(res, 'Errore');
          this.reloadManager.completaReload(event);
        });
    });
  }

  dividiListaOrdini() {
    this.ordiniDaConsegnare = this.ordini.filter(ordine => {
      if (ordine.merci != undefined && ordine.merci != null) {
        for (let i = 0; i < ordine.merci.length; i++) {
          if (ordine.merci[i].id_corriere == null) return ordine;
        }
      }
    });

    this.ordiniCompletati = this.ordini.filter(ordine => {
      if (ordine.merci != undefined && ordine.merci != null) {
        var completato = true;

        for (let i = 0; i < ordine.merci.length; i++) {
          if (ordine.merci[i].id_corriere == null) completato = false;
        }
        if (completato) return ordine;
      }
    });
  }


  async aggiungiCorriere(merce) {
    const modal = await this.modalController.create({
      component: AggiungiCorrierePage,
      componentProps: {
        id: merce.id,
        id_ordine: merce.id_ordine,
        id_corriere: merce.id_corriere,
        nome: merce.nome,
        prezzo_acquisto: merce.prezzo_acquisto,
        quantita: merce.quantita,
        stato: merce.stato,
      },
      cssClass: 'fullheight'
    });

    modal.onDidDismiss().then((data) => {
      const corriereAggiunto = data['data'];

      if (corriereAggiunto) {
        this.loadOrdini(null);
      }
    });

    return await modal.present();
  }

  async apriDettagli(merce) {
    const modal = await this.modalController.create({
      component: DettagliMercePage,
      componentProps: {
        id: merce.id,
        id_ordine: merce.id_ordine,
        id_corriere: merce.id_corriere,
        nome: merce.nome,
        prezzo_acquisto: merce.prezzo_acquisto,
        quantita: merce.quantita,
        stato: merce.stato,
      },
      cssClass: 'fullheight'
    });

    return await modal.present();
  }

}