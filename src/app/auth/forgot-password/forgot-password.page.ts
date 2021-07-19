import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['../auth.scss'],
})
export class ForgotPasswordPage implements OnInit {

  constructor(public alertController: AlertController) { }

  ngOnInit() {
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Siamo spiacenti!',
      message: 'Questa feature non è ancora stata implementata.',
      buttons: ['CAPITO!']
    });

    await alert.present();
  }

}
