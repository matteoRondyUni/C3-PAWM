import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ErrorManagerService } from 'src/app/services/error-manager.service';

@Component({
  selector: 'app-dipendenti-stats',
  templateUrl: './dipendenti-stats.component.html',
  styleUrls: ['./dipendenti-stats.component.scss'],
})
export class DipendentiStatsComponent implements OnInit {
  n_dipendenti: any;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private errorManager: ErrorManagerService,
  ) {
    this.getNumeroDipendenti()
  }

  ngOnInit() { }

  async getNumeroDipendenti() {
    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };

    this.http.get('/dipendenti/count', { headers }).subscribe(
      async (res) => {
        this.n_dipendenti = res['count'];
      },
      async (res) => {
        this.errorManager.stampaErrore(res, 'Errore');
      });
  }

}
