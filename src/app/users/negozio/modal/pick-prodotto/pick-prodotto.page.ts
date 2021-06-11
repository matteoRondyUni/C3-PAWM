import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ErrorManagerService } from 'src/app/services/error-manager.service';

@Component({
  selector: 'app-pick-prodotto',
  templateUrl: './pick-prodotto.page.html',
  styleUrls: ['./pick-prodotto.page.scss'],
})
export class PickProdottoPage implements OnInit {
  @Input() prodotti_inseriti;
  private inventario = [];
  prodotti_selezionabili = [];

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private errorManager: ErrorManagerService,
    private modalController: ModalController,
    private navParams: NavParams) {
    this.loadInventario();
    this.prodotti_selezionabili = [];
  }

  ngOnInit() {
    this.prodotti_inseriti = this.navParams.get('prodotti_inseriti');
  }

  async closeModal() {
    this.modalController.dismiss();
  }

  getProdottiSelezionabili() {
    if (this.prodotti_inseriti.length > 0) {
      this.inventario.forEach(prodotto => {
        var presente = false;
        this.prodotti_inseriti.forEach(inserito => {
          if (prodotto.id == inserito.id) presente = true;
        })
        if (!presente) this.prodotti_selezionabili.push(prodotto);
      })

      this.prodotti_selezionabili = [...this.prodotti_selezionabili,];
    } else this.prodotti_selezionabili = this.inventario;

    console.log("this.prodotti_selezionabili:", this.prodotti_selezionabili)

  }

  async loadInventario() {
    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };

    this.http.get('/inventario', { headers }).subscribe(
      async (res) => {
        this.inventario = res['results'];
        console.log("this.prodotti_inseriti:", this.prodotti_inseriti)
        this.getProdottiSelezionabili();
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

  pick(prodotto) {
    this.modalController.dismiss(prodotto);
  }

}