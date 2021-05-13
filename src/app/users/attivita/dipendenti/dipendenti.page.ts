import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../../../services/authentication.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-dipendenti',
  templateUrl: './dipendenti.page.html',
  styleUrls: ['./dipendenti.page.scss'],
})
export class DipendentiPage implements OnInit {
  dipendenti = [];
  token: JSON;

  constructor(private http: HttpClient, private authService: AuthenticationService, private alertController: AlertController) {
    this.loadDipendenti();
  }

  ngOnInit() {
  }

  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }

  async loadDipendenti() {
    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };

    this.http.get('/dipendenti', { headers }).subscribe(
      res => {
        this.dipendenti = res['results'].sort((a, b) => {
          if (a.cognome < b.cognome) {
            return -1;
          }
          if (a.cognome > b.cognome) {
            return 1;
          }
          return 0;
        });
        console.log(this.dipendenti);
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
}
