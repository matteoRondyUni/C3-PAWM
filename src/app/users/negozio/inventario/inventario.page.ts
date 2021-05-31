import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ErrorManagerService } from 'src/app/services/error-manager.service';
import { CreaProdottoPage } from '../modal/crea-prodotto/crea-prodotto.page';
import { DettagliProdottoPage } from '../modal/dettagli-prodotto/dettagli-prodotto.page';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {
  inventario = [];

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private errorManager: ErrorManagerService,
    private modalController: ModalController) {
    this.loadInventario();
  }

  ngOnInit() {
  }

  async loadInventario() {
    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };

    this.http.get('/inventario', { headers }).subscribe(
      async (res) => {
        this.inventario = res['results'];
      },
      async (res) => {
        this.errorManager.stampaErrore(res, 'Errore');
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

      if (creato) {
        this.loadInventario();
      }
    });

    return await modal.present();
  }

  async apriDettagli(prodotto) {
    const modal = await this.modalController.create({
      component: DettagliProdottoPage,
      componentProps: {
        id_prodotto: prodotto.id,
        nome: prodotto.nome,
        quantita: prodotto.quantita,
        prezzo: prodotto.prezzo
      },
      cssClass: 'fullheight'
    });

    modal.onDidDismiss().then((data) => {
      const eliminato = data['data'];

      if (eliminato) {
        this.loadInventario();
      }
    });

    return await modal.present();
  }
}
