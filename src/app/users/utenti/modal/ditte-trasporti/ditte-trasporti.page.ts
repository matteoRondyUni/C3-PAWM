import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { ErrorManagerService } from 'src/app/services/error-manager/error-manager.service';

@Component({
  selector: 'app-ditte-trasporti',
  templateUrl: './ditte-trasporti.page.html',
  styleUrls: ['./ditte-trasporti.page.scss'],
})
export class DitteTrasportiPage implements OnInit {
  ditte = [];

  constructor(
    private modalController: ModalController,
    private http: HttpClient,
    private errorManager: ErrorManagerService,
    private loadingController: LoadingController
  ) {
    this.loadDitte();
  }

  ngOnInit() {
  }

  async closeModal() {
    this.modalController.dismiss();
  }

  async loadDitte() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.http.get('/ditte-trasporti').subscribe(
      async (res) => {
        this.ditte = res['results'];
        await loading.dismiss();
      },
      async (res) => {
        await loading.dismiss();
        this.errorManager.stampaErrore(res, 'Errore');
      });
  }

}
