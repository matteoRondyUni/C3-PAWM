import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavParams } from '@ionic/angular';
import { map, switchMap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ErrorManagerService } from 'src/app/services/error-manager.service';

@Component({
  selector: 'app-aggiungi-corriere',
  templateUrl: './aggiungi-corriere.page.html',
  styleUrls: ['./aggiungi-corriere.page.scss'],
})
export class AggiungiCorrierePage implements OnInit {
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
    private loadingController: LoadingController,
    private alertController: AlertController,
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

  caricaInformazioni() {
    this.dipendenti.forEach(dipendente => {
      if (dipendente.id == this.id_corriere) this.corriere = dipendente;
    });
  }

  async pickCorriere(corriere) {
    this.corriere = corriere;
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

  async assegnaCorriere() {
    const loading = await this.loadingController.create();
    await loading.present();

    const token_value = (await this.authService.getToken()).value;
    const to_send = {
      'id_ordine': this.id_ordine,
      'id_corriere': this.corriere.id,
      'token_value': token_value
    }

    this.http.put('/ditta-trasporto/ordine/merce/' + this.id, to_send).pipe(
      map((data: any) => data.esito),
      switchMap(esito => { return esito; })).subscribe(
        async (res) => {
          const text = 'I dati del prodotto sono stati aggiornati';
          await loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Prodotto modificato',
            message: text,
            buttons: ['OK'],
          });
          this.modalController.dismiss(true);
          await alert.present();
        },
        async (res) => {
          await loading.dismiss();
          this.modalController.dismiss(false);
          this.errorManager.stampaErrore(res, 'Modifica Fallita');
        });
  }

}