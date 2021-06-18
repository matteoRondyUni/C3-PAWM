import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
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
    private modalController: ModalController,
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

  segnaComeRitirato(ordine) {
    this.risultati_ricerca = [];

    const index = this.ordini_attivi.indexOf(ordine, 0);
    if (index > -1) this.ordini_attivi.splice(index, 1);
    this.ordini_attivi = [...this.ordini_attivi];

    this.ordini_ritirati = [...this.ordini_ritirati, ordine];
  }
}
