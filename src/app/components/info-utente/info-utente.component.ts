import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ErrorManagerService } from 'src/app/services/error-manager.service';

@Component({
  selector: 'app-info-utente',
  templateUrl: './info-utente.component.html',
  styleUrls: ['./info-utente.component.scss'],
})
export class InfoUtenteComponent implements OnInit {
  utente = {};

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private errorManager: ErrorManagerService
  ) { this.loadInformazioni(); }

  ngOnInit() { }

  async loadInformazioni() {
    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };

    this.http.get('/info/utente', { headers }).subscribe(
      async (res) => {
        const tmp = res['results'];
        this.utente = tmp[0];
        console.log(this.utente);
      },
      async (res) => {
        this.errorManager.stampaErrore(res, 'Errore');
      });
  }

}
