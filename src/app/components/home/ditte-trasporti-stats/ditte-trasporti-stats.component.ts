import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ErrorManagerService } from 'src/app/services/error-manager.service';

@Component({
  selector: 'app-ditte-trasporti-stats',
  templateUrl: './ditte-trasporti-stats.component.html',
  styleUrls: ['../home-components.scss'],
})
export class DitteTrasportiStatsComponent implements OnInit {
  n_ditte: any;
  nome;
  sottotitolo;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private errorManager: ErrorManagerService,
  ) {
    this.getNumeroDitte()
  }

  ngOnInit() { }

  async getNumeroDitte() {
    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };

    this.http.get('/ditte/count', { headers }).subscribe(
      async (res) => {
        this.n_ditte = res['count'];
        if (this.n_ditte == 1) {
          this.nome = 'ditta trasporti';
          this.sottotitolo = 'convenzionata con C3-PAWM';
        }
        else {
          this.nome = 'ditte trasporti';
          this.sottotitolo = 'convenzionate con C3-PAWM';
        }
      },
      async (res) => {
        this.errorManager.stampaErrore(res, 'Errore');
      });
  }

}
