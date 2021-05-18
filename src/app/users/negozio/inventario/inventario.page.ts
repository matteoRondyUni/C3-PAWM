import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CreaProdottoPage } from '../modal/crea-prodotto/crea-prodotto.page';
import { DettagliProdottoPage } from '../modal/dettagli-prodotto/dettagli-prodotto.page';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {
  // inventario = [];

  inventario = [
    {
      'id': 1,
      'nome': "Sony Playstation 1",
      'quantita': 25,
      'prezzo': 100
    },
    {
      'id': 2,
      'nome': "Sony Playstation 2",
      'quantita': 12,
      'prezzo': 799
    },
    {
      'id': 3,
      'nome': "Sony Playstation 3",
      'quantita': 3,
      'prezzo': 499
    },
    {
      'id': 4,
      'nome': "Sony Playstation 4",
      'quantita': 5,
      'prezzo': 499
    },
    {
      'id': 5,
      'nome': "Sony Playstation 5",
      'quantita': 5,
      'prezzo': 499
    },
    {
      'id': 6,
      'nome': "Xbox 360",
      'quantita': 5,
      'prezzo': 499
    },
    {
      'id': 7,
      'nome': "Xbox One",
      'quantita': 5,
      'prezzo': 499
    },
    {
      'id': 8,
      'nome': "Xbox Series X",
      'quantita': 5,
      'prezzo': 499
    }
  ];

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private modalController: ModalController) {
    this.loadInventario();
  }

  ngOnInit() {
  }

  async loadInventario() {
    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };

    this.http.get('/inventario', { headers }).subscribe(
      async res => {
        this.inventario = res['results'];
      },
      async res => {
        const alert = await this.alertController.create({
          header: 'Errore nella sessione',
          message: "Rieffettua il login",
          buttons: ['OK'],
        });
        await alert.present();
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
