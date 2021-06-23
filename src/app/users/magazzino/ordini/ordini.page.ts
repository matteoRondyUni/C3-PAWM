import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { map, switchMap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ErrorManagerService } from 'src/app/services/error-manager.service';

@Component({
  selector: 'app-ordini',
  templateUrl: './ordini.page.html',
  styleUrls: ['./ordini.page.scss'],
})
export class OrdiniPage implements OnInit {
  public segment: string = "cerca";
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
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) {
    this.loadOrdini()
  }

  ngOnInit() {
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }

  cercaOrdine(event) {
    var trovato: Boolean;
    this.nessun_risultato = false;

    this.risultati_ricerca = this.ordini_attivi.filter(ordine => {
      if (ordine.codice_ritiro === event.target.value) {
        trovato = true;
        return ordine;
      }
    });

    if (!trovato) this.nessun_risultato = true;
  }

  async loadOrdini() {
    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };

    this.http.get('/ordini', { headers }).subscribe(
      async (res) => {
        this.ordini = res['results'];
        this.loadMerci(this.ordini, token_value);
        this.filtraOrdini();
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

    this.http.put('/ordine/' + ordine.id, to_send).pipe(
      map((data: any) => data.esito),
      switchMap(esito => { return esito; })).subscribe(
        async (res) => {
          const text = 'L\'ordine è stato contrassegnato come ritirato';
          await loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Ordine ritirato',
            message: text,
            buttons: ['OK'],
          });
          this.loadOrdini();
          await alert.present();
        },
        async (res) => {
          await loading.dismiss();
          this.errorManager.stampaErrore(res, 'Modifica Fallita');
        });
  }
}