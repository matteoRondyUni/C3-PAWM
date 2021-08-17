import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { ErrorManagerService } from 'src/app/services/error-manager/error-manager.service';

@Component({
  selector: 'app-acquisti-stats',
  templateUrl: './acquisti-stats.component.html',
  styleUrls: ['../home-components.scss'],
})
export class AcquistiStatsComponent implements OnInit {
  acquisti_totali: number;
  acquisti_ultimo_mese: number;
  current_month: string;
  current_year: number;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private errorManager: ErrorManagerService,
  ) {
    this.getStatistiche();
    this.getCurrentDate();
  }

  ngOnInit() { }

  getCurrentDate() {
    const mesi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
      "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
    ];
    this.current_month = mesi[new Date().getMonth()]
    this.current_year = new Date().getFullYear();
  }

  async getStatistiche() {
    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };

    this.http.get('/ordini/stats', { headers }).subscribe(
      async (res) => {
        var tmp = res['results'];
        this.acquisti_totali = tmp.vendite_totali;
        this.acquisti_ultimo_mese = tmp.vendite_ultimo_mese;
      },
      async (res) => {
        this.errorManager.stampaErrore(res, 'Errore');
      });
  }
}
