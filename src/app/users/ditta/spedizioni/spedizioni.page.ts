import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ErrorManagerService } from 'src/app/services/error-manager.service';
import { DettagliOrdinePage } from '../modal/dettagli-ordine/dettagli-ordine.page';

@Component({
  selector: 'app-spedizioni',
  templateUrl: './spedizioni.page.html',
  styleUrls: ['./spedizioni.page.scss'],
})
export class SpedizioniPage implements OnInit {
  ordini = [];

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private errorManager: ErrorManagerService,
    private modalController: ModalController) {
    this.loadOrdini();
  }

  ngOnInit() {
  }

  async loadOrdini() {
    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };

    this.http.get('/spedizioni', { headers }).subscribe(
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
          console.log("ordine: ", ordine);
        },
        async (res) => {
          this.errorManager.stampaErrore(res, 'Errore');
        });
    });
  }

  async apriDettagli() {

  }
}
