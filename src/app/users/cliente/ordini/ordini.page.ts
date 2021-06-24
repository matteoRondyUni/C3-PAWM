import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ErrorManagerService } from 'src/app/services/error-manager.service';

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
    private errorManager: ErrorManagerService) {
    this.loadOrdini(null);
  }

  ngOnInit() {
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }

  /**
   * Inizia il Reload degli Ordini.
   * @param event 
   */
  reloadOrdini(event) {
    this.loadOrdini(event)
  }

  /**
   * Termina il Reload degli Ordini.
   * @param event 
   */
  completaReload(event) {
    if (event != null)
      event.target.complete();
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
        this.loadProdotti(this.ordini, token_value, event);
        this.loadInfoOrdine();
        console.log(this.ordini);
      },
      async (res) => {
        this.errorManager.stampaErrore(res, 'Errore');
        this.completaReload(event);
      });
  }

  loadProdotti(ordini, token_value, event) {
    ordini.forEach(ordine => {
      const headers = { 'token': token_value };
      this.http.get('/merci/' + ordine.id, { headers }).subscribe(
        async (res) => {
          var prodotti = res['results'];
          ordine[prodotti];
          ordine.prodotti = prodotti;
          this.dividiListaOridini();
          this.completaReload(event);
        },
        async (res) => {
          this.errorManager.stampaErrore(res, 'Errore');
          this.completaReload(event);
        });
    });
  }

  dividiListaOridini() {
    this.dividiOrdiniInTransito();
    this.dividiOrdiniDaRitirare();
    this.dividiOrdiniRitirati();
  }

  dividiOrdiniInTransito() {
    this.ordiniInTransito = this.ordini.filter(ordine => {
      var inTransito = false;

      if (ordine.prodotti != undefined && ordine.prodotti != null && ordine.stato != 'RITIRATO')
        for (let i = 0; i < ordine.prodotti.length; i++)
          if (ordine.prodotti[i].stato == 'IN_TRANSITO' || ordine.prodotti[i].stato == 'PAGATO') inTransito = true;

      if (inTransito) return ordine;
    });
  }

  dividiOrdiniDaRitirare() {
    this.ordiniDaRitirare = this.ordini.filter(ordine => {
      if (ordine.prodotti != undefined && ordine.prodotti != null && ordine.stato != 'RITIRATO') {
        var consegnato = true;

        for (let i = 0; i < ordine.prodotti.length; i++)
          if (ordine.prodotti[i].stato != 'CONSEGNATO') consegnato = false;

        if (consegnato) return ordine;
      }
    });
  }

  dividiOrdiniRitirati() {
    this.ordiniRitirati = this.ordini.filter(ordine => {
      if (ordine.stato === 'RITIRATO') return ordine;
    });
  }

  /**
   * Carica le Informazioni dell'Ordine.
   */
  loadInfoOrdine() {
    this.loadInfoMagazzino();
    this.loadInfoDitta();
    this.loadInfoNegozio();
  }

  /**
   * Carica le informazioni del Magazzino collegato all'Ordine.
   */
  loadInfoMagazzino() {
    this.ordini.forEach(ordine => {
      this.http.get('/magazzini/' + ordine.id_magazzino).subscribe(
        async (res) => {
          var info = res['results'];
          ordine.magazzino_nome = info[0].ragione_sociale;
        },
        async (res) => {
          this.errorManager.stampaErrore(res, 'Errore');
        });
    })
  }

  /**
   * Carica le informazioni della Ditta di Trasporti collegata all'Ordine.
   */
  loadInfoDitta() {
    this.ordini.forEach(ordine => {
      this.http.get('/ditte-trasporti/' + ordine.id_ditta).subscribe(
        async (res) => {
          var info = res['results'];
          ordine.ditta_nome = info[0].ragione_sociale;
        },
        async (res) => {
          this.errorManager.stampaErrore(res, 'Errore');
        });
    })
  }

  /**
   * Carica le informazioni del Negozio collegato all'Ordine.
   */
  loadInfoNegozio() {
    this.ordini.forEach(ordine => {
      this.http.get('/negozi/' + ordine.id_negozio).subscribe(
        async (res) => {
          var info = res['results'];
          ordine.negozio_nome = info[0].ragione_sociale;
        },
        async (res) => {
          this.errorManager.stampaErrore(res, 'Errore');
        });
    })
  }

}