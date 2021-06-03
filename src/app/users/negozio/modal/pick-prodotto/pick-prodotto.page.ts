import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ErrorManagerService } from 'src/app/services/error-manager.service';

@Component({
  selector: 'app-pick-prodotto',
  templateUrl: './pick-prodotto.page.html',
  styleUrls: ['./pick-prodotto.page.scss'],
})
export class PickProdottoPage implements OnInit {
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

  async closeModal() {
    this.modalController.dismiss();
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

  pick(prodotto) {
    this.modalController.dismiss(prodotto);
  }

}