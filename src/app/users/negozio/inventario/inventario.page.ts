import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ErrorManagerService } from 'src/app/services/error-manager.service';
import { ReloadManagerService } from 'src/app/services/reload-manager.service';
import { CreaProdottoPage } from '../modal/crea-prodotto/crea-prodotto.page';
import { DettagliProdottoPage } from '../modal/dettagli-prodotto/dettagli-prodotto.page';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {
  segment: string = "inCatalogo";
  inventario = [];
  inventarioInCatalogo = [];
  inventarioNonInCatalogo = [];

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private errorManager: ErrorManagerService,
    private reloadManager: ReloadManagerService,
    private modalController: ModalController) {
    this.loadInventario(null);
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
    this.loadInventario(event);
  }

  async loadInventario(event) {
    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };

    this.http.get('/inventario', { headers }).subscribe(
      async (res) => {
        this.inventario = res['results'];
        this.filtraInventario();
        this.reloadManager.completaReload(event);
      },
      async (res) => {
        this.errorManager.stampaErrore(res, 'Errore');
        this.reloadManager.completaReload(event);
      });
  }

  filtraInventario() {
    this.inventarioInCatalogo = [];
    this.inventarioNonInCatalogo = [];

    this.inventarioInCatalogo = this.inventario.filter(prodotto => {
      if (prodotto.stato == 'IN_CATALOGO') return prodotto;
    });
    this.inventarioNonInCatalogo = this.inventario.filter(prodotto => {
      if (prodotto.stato == 'NON_IN_CATALOGO') return prodotto;
    });
  }

  separateLetter(record, recordIndex, records) {
    if (recordIndex == 0) {
      return record.nome[0].toUpperCase();
    }

    let first_prev = records[recordIndex - 1].nome[0];
    let first_curr = record.nome[0];

    if (first_prev != first_curr) {
      return first_curr.toUpperCase();
    }
    return null;
  }

  async creaProdotto() {
    const modal = await this.modalController.create({
      component: CreaProdottoPage,
      cssClass: 'fullheight'
    });

    modal.onDidDismiss().then((data) => {
      const creato = data['data'];

      if (creato) this.loadInventario(null);
    });

    return await modal.present();
  }

  async apriDettagli(prodotto) {
    const modal = await this.modalController.create({
      component: DettagliProdottoPage,
      componentProps: {
        id_prodotto: prodotto.id,
        nome: prodotto.nome,
        disponibilita: prodotto.disponibilita,
        prezzo: prodotto.prezzo
      },
      cssClass: 'fullheight'
    });

    modal.onDidDismiss().then((data) => {
      const eliminato = data['data'];

      if (eliminato) this.loadInventario(null);
    });

    return await modal.present();
  }
}