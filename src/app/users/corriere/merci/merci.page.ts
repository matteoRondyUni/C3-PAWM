import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { map, switchMap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ErrorManagerService } from 'src/app/services/error-manager.service';

@Component({
  selector: 'app-merci',
  templateUrl: './merci.page.html',
  styleUrls: ['./merci.page.scss'],
})
export class MerciPage implements OnInit {
  public segment: string = "ritirate";
  merci = [];
  merciDaRitirare = [];
  merciInTransito = [];

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private errorManager: ErrorManagerService,
    private loadingController: LoadingController,
    private alertController: AlertController) {
    this.loadMerci();
  }

  ngOnInit() {
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }

  async loadMerci() {
    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };

    this.merci = [];
    this.merciDaRitirare = [];
    this.merciInTransito = [];

    this.http.get('/corriere/consegna/merci', { headers }).subscribe(
      async (res) => {
        this.merci = res['results'];
        this.dividiLista();
      },
      async (res) => {
        this.errorManager.stampaErrore(res, 'Errore');
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

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Cambiare lo stato della merce!',
      message: messaggio,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Okay',
          handler: () => {
            this.cambiaStatoMerce(merce);
          }
        }
      ]
    });

    await alert.present();
  }

  async cambiaStatoMerce(merce) {
    const loading = await this.loadingController.create();
    await loading.present();

    const token_value = (await this.authService.getToken()).value;
    const to_send = {
      'token_value': token_value
    }

    this.http.put('/merci/' + merce.id, to_send).pipe(
      map((data: any) => data.esito),
      switchMap(esito => { return esito; })).subscribe(
        async (res) => {
          const text = 'I dati della merce sono stati aggiornati';
          await loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Merce modificata',
            message: text,
            buttons: ['OK'],
          });
          this.loadMerci();
          await alert.present();
        },
        async (res) => {
          await loading.dismiss();
          this.errorManager.stampaErrore(res, 'Modifica Fallita');
        });
  }

}