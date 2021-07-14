import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { ErrorManagerService } from 'src/app/services/error-manager.service';

@Component({
  selector: 'app-magazzini',
  templateUrl: './magazzini.page.html',
  styleUrls: ['./magazzini.page.scss'],
})
export class MagazziniPage implements OnInit {
  magazzini = [];

  constructor(
    private modalController: ModalController,
    private http: HttpClient,
    private errorManager: ErrorManagerService,
    private loadingController: LoadingController
  ) {
    this.loadMagazzini();
  }

  ngOnInit() {
  }

  async closeModal() {
    this.modalController.dismiss();
  }

  async loadMagazzini() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.http.get('/magazzini').subscribe(
      async (res) => {
        this.magazzini = res['results'];
        await loading.dismiss();
      },
      async (res) => {
        await loading.dismiss();
        this.errorManager.stampaErrore(res, 'Errore');
      });
  }
}
