import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorManagerService } from './error-manager.service';

@Injectable({
  providedIn: 'root'
})
export class InfoOrdineLoaderService {

  constructor(
    private http: HttpClient,
    private errorManager: ErrorManagerService) { }

  /**
   * Carica le Informazioni dell'Ordine.
   */
  loadInfoOrdine(ordini) {
    this.loadInfoMagazzino(ordini);
    this.loadInfoDitta(ordini);
    this.loadInfoNegozio(ordini);
  }

  /**
   * Carica le informazioni del Magazzino collegato all'Ordine.
   */
  loadInfoMagazzino(ordini) {
    ordini.forEach(ordine => {
      if (ordine.id_magazzino != null) {
        this.http.get('/magazzini/' + ordine.id_magazzino).subscribe(
          async (res) => {
            var info = res['results'];
            ordine.magazzino_nome = info[0].ragione_sociale;
          },
          async (res) => {
            this.errorManager.stampaErrore(res, 'Errore');
          });
      }
    })
  }

  /**
   * Carica le informazioni della Ditta di Trasporti collegata all'Ordine.
   */
  loadInfoDitta(ordini) {
    ordini.forEach(ordine => {
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
  loadInfoNegozio(ordini) {
    ordini.forEach(ordine => {
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