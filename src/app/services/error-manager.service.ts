import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ErrorManagerService {

  constructor(private alertController: AlertController) { }

  async stampaErrore(res, headerText) {
    const alert = await this.alertController.create({
      header: headerText,
      message: res.error,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
