import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AlertManagerService } from 'src/app/services/alert-manager/alert-manager.service';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { ErrorManagerService } from 'src/app/services/error-manager/error-manager.service';
import { ReloadManagerService } from 'src/app/services/reload-manager/reload-manager.service';

@Component({
  selector: 'app-merci',
  templateUrl: './merci.page.html',
  styleUrls: ['./merci.page.scss'],
})
export class MerciPage implements OnInit {
  segment: string = "ritirate";
  merci = [];
  merciDaRitirare = [];
  merciInTransito = [];

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private errorManager: ErrorManagerService,
    private loadingController: LoadingController,
    private alertManager: AlertManagerService,
    private reloadManager: ReloadManagerService) {
    this.loadMerci(null);
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
    this.loadMerci(event)
  }

  async loadMerci(event) {
    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };

    this.merci = [];
    this.merciDaRitirare = [];
    this.merciInTransito = [];

    this.http.get('/corriere/consegna/merci', { headers }).subscribe(
      async (res) => {
        this.merci = res['results'];
        this.dividiLista();
        this.caricaIndirizzoMerce();
        this.reloadManager.completaReload(event);
      },
      async (res) => {
        this.errorManager.stampaErrore(res, 'Errore');
        this.reloadManager.completaReload(event);
      });
  }

  dividiLista() {
    this.merci.forEach(merce => {
      var daRitirare = false;

      if (merce.stato == 'PAGATO') daRitirare = true;

      if (daRitirare) {
        if (!this.merciDaRitirare.includes(merce))
          this.merciDaRitirare = [...this.merciDaRitirare, merce];
      } else
        if (!this.merciInTransito.includes(merce))
          this.merciInTransito = [...this.merciInTransito, merce];
    })
  }

  async presentAlertConfirm(merce) {
    var messaggio;

    switch (merce.stato) {
      case "PAGATO":
        messaggio = "Impostare lo stato della merce come 'IN TRANSITO'?";
        break;
      case "IN_TRANSITO":
        messaggio = "Impostare lo stato della merce come 'CONSEGNATO'?";
        break;
    }

    this.alertManager.createConfirmationAlert(messaggio, () => { this.cambiaStatoMerce(merce); });
  }

  async cambiaStatoMerce(merce) {
    const loading = await this.loadingController.create();
    await loading.present();

    const token_value = (await this.authService.getToken()).value;
    const to_send = {
      'token_value': token_value
    }

    this.http.put('/merci/' + merce.id, to_send).subscribe(
      async (res) => {
        await loading.dismiss();
        this.loadMerci(null);
        this.alertManager.createInfoAlert('Merce modificata', 'I dati della merce sono stati aggiornati');
      },
      async (res) => {
        await loading.dismiss();
        this.errorManager.stampaErrore(res, 'Modifica Fallita');
      });
  }

  async caricaIndirizzoMerce() {
    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };
    this.merci.forEach(merce => {
      if (merce.id_magazzino == null) {
        this.http.get('/corriere/merce/' + merce.id + '/indirizzo/cliente', { headers }).subscribe(
          async (res) => {
            var info = res['results'];
            merce.indirizzo = info[0].indirizzo;
          },
          async (res) => {
            this.errorManager.stampaErrore(res, 'Errore');
          });
      } else {
        this.http.get('/magazzini/' + merce.id_magazzino).subscribe(
          async (res) => {
            var info = res['results'];
            merce.indirizzo = info[0].indirizzo;
          },
          async (res) => {
            this.errorManager.stampaErrore(res, 'Errore');
          });
      }
    })
  }
}