import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-pick-magazzino',
  templateUrl: './pick-magazzino.page.html',
  styleUrls: ['./pick-magazzino.page.scss'],
})
export class PickMagazzinoPage implements OnInit {
  magazzini = [];

  constructor(
    private http: HttpClient,
    private alertController: AlertController,
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
      async res => {
        this.magazzini = res['results'];
        console.log("magazzini:", this.magazzini);
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

  pick(magazzino) {
    this.modalController.dismiss(magazzino);
  }

}