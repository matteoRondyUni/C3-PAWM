import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ErrorManagerService } from 'src/app/services/error-manager.service';

@Component({
  selector: 'app-pick-ditta',
  templateUrl: './pick-ditta.page.html',
  styleUrls: ['./pick-ditta.page.scss'],
})
export class PickDittaPage implements OnInit {
  ditte = [];

  constructor(
    private http: HttpClient,
    private errorManager: ErrorManagerService,
    private modalController: ModalController,
  ) {
    this.loadDitte();
  }

  ngOnInit() {
  }

  async closeModal() {
    this.modalController.dismiss();
  }

  async loadDitte() {
    this.http.get('/ditte-trasporti').subscribe(
      async (res) => {
        this.ditte = res['results'];
        console.log("ditte:", this.ditte);
      },
      async (res) => {
        this.errorManager.stampaErrore(res, 'Errore');
      });
  }

  pick(ditta) {
    this.modalController.dismiss(ditta);
  }

}