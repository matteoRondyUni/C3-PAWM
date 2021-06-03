import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ErrorManagerService } from 'src/app/services/error-manager.service';
import { ModalController } from '@ionic/angular';

import { CreaDipendentePage } from '../modal/crea-dipendente/crea-dipendente.page';
import { DettagliDipendentePage } from '../modal/dettagli-dipendente/dettagli-dipendente.page';

@Component({
  selector: 'app-dipendenti',
  templateUrl: './dipendenti.page.html',
  styleUrls: ['./dipendenti.page.scss'],
})
export class DipendentiPage implements OnInit {
  dipendenti = [];

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private errorManager: ErrorManagerService,
    private modalController: ModalController) {
    this.loadDipendenti();
  }

  ngOnInit() {
  }

  //TODO eliminare
  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }

  async loadDipendenti() {
    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };

    this.http.get('/dipendenti', { headers }).subscribe(
      async (res) => {
        this.dipendenti = res['results'];
      },
      async (res) => {
        this.errorManager.stampaErrore(res, 'Errore');
      });
  }

  separateLetter(record, recordIndex, records) {
    if (recordIndex == 0) {
      return record.cognome[0].toUpperCase();
    }

    let first_prev = records[recordIndex - 1].cognome[0];
    let first_curr = record.cognome[0];

    if (first_prev != first_curr) {
      return first_curr.toUpperCase();
    }
    return null;
  }

  async creaDipendente() {
    const modal = await this.modalController.create({
      component: CreaDipendentePage,
      cssClass: 'fullheight'
    });

    modal.onDidDismiss().then((data) => {
      const creato = data['data'];

      if (creato) {
        this.loadDipendenti();
      }
    });

    return await modal.present();
  }

  async apriDettagli(dipendente) {
    const modal = await this.modalController.create({
      component: DettagliDipendentePage,
      componentProps: {
        id_dipendente: dipendente.id,
        nome: dipendente.nome,
        cognome: dipendente.cognome,
        email: dipendente.email,
        telefono: dipendente.telefono,
        indirizzo: dipendente.indirizzo,
      },
      cssClass: 'fullheight'
    });

    modal.onDidDismiss().then((data) => {
      const eliminato = data['data'];

      if (eliminato) {
        this.loadDipendenti();
      }
    });

    return await modal.present();
  }
}
