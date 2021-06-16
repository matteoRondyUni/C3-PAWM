import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ErrorManagerService } from 'src/app/services/error-manager.service';

@Component({
  selector: 'app-dettagli-merce',
  templateUrl: './dettagli-merce.page.html',
  styleUrls: ['./dettagli-merce.page.scss'],
})
export class DettagliMercePage implements OnInit {
  @Input() id;
  @Input() id_ordine;
  @Input() id_corriere;
  @Input() nome;
  @Input() prezzo_acquisto;
  @Input() quantita;
  @Input() stato;

  dipendenti = [];
  corriere = { "id": null };

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private errorManager: ErrorManagerService,
    private modalController: ModalController,
    private navParams: NavParams) {
    this.loadDipendenti();
  }

  ngOnInit() {
    this.id = this.navParams.get('id');
    this.id_ordine = this.navParams.get('id_ordine');
    this.id_corriere = this.navParams.get('id_corriere');
    this.nome = this.navParams.get('nome');
    this.prezzo_acquisto = this.navParams.get('prezzo_acquisto');
    this.quantita = this.navParams.get('quantita');
    this.stato = this.navParams.get('stato');
  }

  async closeModal() {
    this.modalController.dismiss();
  }

  async loadDipendenti() {
    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };

    this.http.get('/dipendenti', { headers }).subscribe(
      async (res) => {
        this.dipendenti = res['results'];
        this.caricaInformazioni();
      },
      async (res) => {
        this.errorManager.stampaErrore(res, 'Errore');
      });
  }

  caricaInformazioni() {
    this.dipendenti.forEach(dipendente => {
      if (dipendente.id == this.id_corriere) this.corriere = dipendente;
    });
  }

}