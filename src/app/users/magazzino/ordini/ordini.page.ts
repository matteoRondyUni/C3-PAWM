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
  ordini_attivi = [
    {
      'id': 1, 'data_ordine': '2021-06-11', 'stato': 'PAGATO', 'tipo': 'MAGAZZINO', 'codice_ritiro': 'abc123',
      'merci': [
        { 'id': 1, 'nome': 'Pizza', 'quantita': 8, 'stato': 'PAGATO' },
        { 'id': 2, 'nome': 'Panino', 'quantita': 2, 'stato': 'PAGATO' },
        { 'id': 3, 'nome': 'Lasagna', 'quantita': 21, 'stato': 'PAGATO' }
      ]
    },
    {
      'id': 2, 'data_ordine': '2021-06-09', 'stato': 'PAGATO', 'tipo': 'MAGAZZINO', 'codice_ritiro': '777dpg',
      'merci': [
        { 'id': 4, 'nome': 'Piadina', 'quantita': 300, 'stato': 'PAGATO' },
        { 'id': 5, 'nome': 'Bruschetta', 'quantita': 15, 'stato': 'PAGATO' },
        { 'id': 6, 'nome': 'Gelato', 'quantita': 3, 'stato': 'PAGATO' }
      ]
    }
  ];
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
    //this.searchbar.addEventListener('ionInput', this.handleInput);
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

  loadOrdini() {

  }

  segnaComeRitirato(ordine) {
    this.risultati_ricerca = [];

    const index = this.ordini_attivi.indexOf(ordine, 0);
    if (index > -1) this.ordini_attivi.splice(index, 1);
    this.ordini_attivi = [...this.ordini_attivi];

    this.ordini_ritirati = [...this.ordini_ritirati, ordine];
  }
}
