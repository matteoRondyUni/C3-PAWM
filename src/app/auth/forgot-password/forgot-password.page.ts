import { Component, OnInit } from '@angular/core';
import { AlertManagerService } from 'src/app/services/alert-manager/alert-manager.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['../auth.scss'],
})
export class ForgotPasswordPage implements OnInit {

  constructor(public alertManager: AlertManagerService) { }

  ngOnInit() {
  }

  async presentAlert() {
    this.alertManager.createInfoAlert('Siamo spiacenti!', 'Questa feature non è ancora stata implementata.');
  }
}
