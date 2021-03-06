import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AlertManagerService } from 'src/app/services/alert-manager/alert-manager.service';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { ErrorManagerService } from 'src/app/services/error-manager/error-manager.service';
import { ReloadManagerService } from 'src/app/services/reload-manager/reload-manager.service';

@Component({
  selector: 'app-ordini',
  templateUrl: './ordini.page.html',
  styleUrls: ['./ordini.page.scss'],
})
export class OrdiniPage implements OnInit {
  segment: string = "cerca";
  nessun_risultato = false;
  searchbar = document.querySelector('ion-searchbar');
  ordini = [];
  ordini_attivi = [];
  ordini_ritirati = [];
  risultati_ricerca = [];

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private errorManager: ErrorManagerService,
    private reloadManager: ReloadManagerService,
    private alertManager: AlertManagerService,
    private loadingController: LoadingController,
  ) {
    this.loadOrdini(null)
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
    this.loadOrdini(event);
  }

  cercaOrdine(event) {
    var trovato: Boolean;
    this.nessun_risultato = false;

    this.risultati_ricerca = this.ordini_attivi.filter(ordine => {
      if (ordine.codice_ritiro === event.target.value) {
        trovato = true;
        var tmp = true;

        ordine.merci.forEach(merce => {
          if (merce.stato != 'CONSEGNATO') tmp = false;
        });

        if (tmp)
          return ordine;
        else this.nessun_risultato = true;
      }
    });

    if (!trovato) this.nessun_risultato = true;
  }

  async loadOrdini(event) {
    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };

    this.http.get('/ordini', { headers }).subscribe(
      async (res) => {
        this.ordini = res['results'];
        this.loadMerci(this.ordini, token_value, event);
        this.filtraOrdini();
      },
      async (res) => {
        this.errorManager.stampaErrore(res, 'Errore');
        this.reloadManager.completaReload(event);
      });
  }

  async loadMerci(ordini, token_value, event) {
    if (this.ordini.length == 0)
      this.reloadManager.completaReload(event);

    await ordini.forEach(ordine => {
      const headers = { 'token': token_value };
      this.http.get('/merci/' + ordine.id, { headers }).subscribe(
        async (res) => {
          var merci = res['results'];
          ordine[merci];
          ordine.merci = merci;

          if (this.reloadManager.controlMerciOrdine(this.ordini))
            this.reloadManager.completaReload(event);
        },
        async (res) => {
          this.errorManager.stampaErrore(res, 'Errore');
          this.reloadManager.completaReload(event);
        });
    })
  }

  filtraOrdini() {
    this.ordini_attivi = this.ordini.filter(ordine => {
      if (ordine.stato != 'RITIRATO') return ordine;
    });
    this.ordini_ritirati = this.ordini.filter(ordine => {
      if (ordine.stato === 'RITIRATO') return ordine;
    });
  }

  async segnaComeRitirato(ordine) {
    this.risultati_ricerca = [];
    const loading = await this.loadingController.create();
    await loading.present();

    const token_value = (await this.authService.getToken()).value;
    const to_send = { 'token_value': token_value };

    this.http.put('/ordine/' + ordine.id, to_send).subscribe(
      async (res) => {
        await loading.dismiss();
        this.loadOrdini(null);
        this.alertManager.createInfoAlert('Ordine ritirato', "L'ordine ?? stato contrassegnato come ritirato");
      },
      async (res) => {
        await loading.dismiss();
        this.errorManager.stampaErrore(res, 'Modifica Fallita');
      });
    this.loadOrdini(null);
  }
}
