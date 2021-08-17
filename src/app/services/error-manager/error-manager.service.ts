import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertManagerService } from '../alert-manager/alert-manager.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorManagerService {

  constructor(private alertManager: AlertManagerService, private router: Router) { }

  stampaErrore(res, headerText) {
    if (this.controllaRes(res)) this.stampa(headerText, res.error)
  }

  controllaRes(res) {
    if (res.error == 'JWT non valido!') {
      this.stampa('Errore nella Sessione', 'Rieffettua il Login');
      this.router.navigateByUrl('/login', { replaceUrl: true });
      return false;
    } else return true;
  }

  async stampa(headerText, messageText) {
    this.alertManager.createInfoAlert(headerText, messageText);
  }
}
