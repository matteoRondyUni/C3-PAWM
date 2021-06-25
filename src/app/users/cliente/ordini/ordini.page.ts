import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ErrorManagerService } from 'src/app/services/error-manager.service';
import { ReloadManagerService } from 'src/app/services/reload-manager.service';
import { InfoOrdineLoaderService } from 'src/app/services/info-ordine-loader.service';

@Component({
  selector: 'app-ordini',
  templateUrl: './ordini.page.html',
  styleUrls: ['./ordini.page.scss'],
})
export class OrdiniPage implements OnInit {
  public segment: string = "ordini_in_transito";
  ordini = [];
  ordiniInTransito = [];
  ordiniDaRitirare = [];
  ordiniRitirati = [];

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private errorManager: ErrorManagerService,
    private reloadManager: ReloadManagerService,
    private infoOrdineLoader: InfoOrdineLoaderService) {
    this.loadOrdini(null);
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

  async loadOrdini(event) {
    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };

    this.ordini = [];
    this.ordiniInTransito = [];
    this.ordiniDaRitirare = [];
    this.ordiniRitirati = [];

    this.http.get('/ordini', { headers }).subscribe(
      async (res) => {
        this.ordini = res['results'];
        this.loadMerci(token_value, event);
        this.infoOrdineLoader.loadInfoOrdine(this.ordini);
        console.log(this.ordini);
      },
      async (res) => {
        this.errorManager.stampaErrore(res, 'Errore');
        this.reloadManager.completaReload(event);
      });
  }

  loadMerci(token_value, event) {
    this.ordini.forEach(ordine => {
      const headers = { 'token': token_value };
      this.http.get('/merci/' + ordine.id, { headers }).subscribe(
        async (res) => {
          var merci = res['results'];
          ordine[merci];
          ordine.merci = merci;
          this.dividiListaOrdini();

          if (this.reloadManager.controlMerciOrdine(this.ordini))
            this.reloadManager.completaReload(event);
        },
        async (res) => {
          this.errorManager.stampaErrore(res, 'Errore');
          this.reloadManager.completaReload(event);
        });
    });
  }

  dividiListaOrdini() {
    this.dividiOrdiniInTransito();
    this.dividiOrdiniDaRitirare();
    this.dividiOrdiniRitirati();
  }

  dividiOrdiniInTransito() {
    this.ordiniInTransito = this.ordini.filter(ordine => {
      var inTransito = false;

      if (ordine.merci != undefined && ordine.merci != null && ordine.stato != 'RITIRATO')
        for (let i = 0; i < ordine.merci.length; i++)
          if (ordine.merci[i].stato == 'IN_TRANSITO' || ordine.merci[i].stato == 'PAGATO') inTransito = true;

      if (inTransito) return ordine;
    });
  }

  dividiOrdiniDaRitirare() {
    this.ordiniDaRitirare = this.ordini.filter(ordine => {
      if (ordine.merci != undefined && ordine.merci != null && ordine.stato != 'RITIRATO') {
        var consegnato = true;

        for (let i = 0; i < ordine.merci.length; i++)
          if (ordine.merci[i].stato != 'CONSEGNATO') consegnato = false;

        if (consegnato) return ordine;
      }
    });
  }

  dividiOrdiniRitirati() {
    this.ordiniRitirati = this.ordini.filter(ordine => {
      if (ordine.stato === 'RITIRATO') return ordine;
    });
  }

}