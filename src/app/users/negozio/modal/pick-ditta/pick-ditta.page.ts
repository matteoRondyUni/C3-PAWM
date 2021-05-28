import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-pick-ditta',
  templateUrl: './pick-ditta.page.html',
  styleUrls: ['./pick-ditta.page.scss'],
})
export class PickDittaPage implements OnInit {
  ditte = [];

  constructor(
    private http: HttpClient,
    private alertController: AlertController,
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
      async res => {
        this.ditte = res['results'];
        console.log("ditte:", this.ditte);
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

  pick(ditta) {
    this.modalController.dismiss(ditta);
  }

}