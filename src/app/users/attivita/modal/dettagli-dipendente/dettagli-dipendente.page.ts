import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { ErrorManagerService } from 'src/app/services/error-manager/error-manager.service';
import { AlertManagerService } from 'src/app/services/alert-manager/alert-manager.service';

@Component({
  selector: 'app-dettagli-dipendente',
  templateUrl: './dettagli-dipendente.page.html',
  styleUrls: ['./dettagli-dipendente.page.scss'],
})
export class DettagliDipendentePage implements OnInit {
  @Input() id_dipendente: string;
  @Input() nome: string;
  @Input() cognome: string;
  @Input() email: string;
  @Input() telefono: string;
  @Input() indirizzo: string;


  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private errorManager: ErrorManagerService,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private alertManager: AlertManagerService,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    this.id_dipendente = this.navParams.get('id_dipendente');
    this.nome = this.navParams.get('nome');
    this.cognome = this.navParams.get('cognome');
    this.email = this.navParams.get('email');
    this.telefono = this.navParams.get('telefono');
    this.indirizzo = this.navParams.get('indirizzo');
  }

  async closeModal() {
    this.modalController.dismiss();
  }

  async eliminaDipendente() {
    const loading = await this.loadingController.create();
    await loading.present();

    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };

    this.http.delete('/dipendenti/' + this.id_dipendente, { headers }).subscribe(
      async (res) => {
        await loading.dismiss();
        this.alertManager.createInfoAlert('Dipendente eliminato', 'Il dipendente ' + this.nome + ' ' + this.cognome + ' è stato eliminato');
      },
      async (res) => {
        await loading.dismiss();
        this.modalController.dismiss(false);
        this.errorManager.stampaErrore(res, 'Eliminazione Fallita');
      });
    this.modalController.dismiss(true);
  }
}
