import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { ErrorManagerService } from 'src/app/services/error-manager/error-manager.service';

@Component({
  selector: 'app-negozi',
  templateUrl: './negozi.page.html',
  styleUrls: ['./negozi.page.scss'],
})
export class NegoziPage implements OnInit {
  negozi = [];

  constructor(
    private modalController: ModalController,
    private http: HttpClient,
    private errorManager: ErrorManagerService,
    private loadingController: LoadingController
  ) {
    this.loadNegozi();
  }

  ngOnInit() {
  }

  async closeModal() {
    this.modalController.dismiss();
  }

  async loadNegozi() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.http.get('/negozi').subscribe(
      async (res) => {
        this.negozi = res['results'];
        await loading.dismiss();
      },
      async (res) => {
        await loading.dismiss();
        this.errorManager.stampaErrore(res, 'Errore');
      });
  }
}
