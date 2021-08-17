import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ErrorManagerService } from 'src/app/services/error-manager/error-manager.service';

@Component({
  selector: 'app-pick-magazzino',
  templateUrl: './pick-magazzino.page.html',
  styleUrls: ['./pick-magazzino.page.scss'],
})
export class PickMagazzinoPage implements OnInit {
  magazzini = [];

  constructor(
    private http: HttpClient,
    private errorManager: ErrorManagerService,
    private modalController: ModalController,
  ) {
    this.loadMagazzini();
  }

  ngOnInit() {
  }

  async closeModal() {
    this.modalController.dismiss();
  }

  async loadMagazzini() {
    this.http.get('/magazzini').subscribe(
      async (res) => {
        this.magazzini = res['results'];
      },
      async (res) => {
        this.errorManager.stampaErrore(res, 'Errore');
      });
  }

  pick(magazzino) {
    this.modalController.dismiss(magazzino);
  }

}