import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ErrorManagerService } from 'src/app/services/error-manager.service';

@Component({
  selector: 'app-negozi-stats',
  templateUrl: './negozi-stats.component.html',
  styleUrls: ['../home-components.scss'],
})
export class NegoziStatsComponent implements OnInit {
  n_negozi: any;
  nome;
  sottotitolo;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private errorManager: ErrorManagerService,
  ) {
    this.getNumeroNegozi()
  }

  ngOnInit() { }

  async getNumeroNegozi() {
    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };

    this.http.get('/negozi/count', { headers }).subscribe(
      async (res) => {
        this.n_negozi = res['count'];
        if (this.n_negozi == 1) {
          this.nome = 'negozio';
          this.sottotitolo = 'convenzionato con C3-PAWM';
        }
        else {
          this.nome = 'negozi';
          this.sottotitolo = 'convenzionati con C3-PAWM';
        }
      },
      async (res) => {
        this.errorManager.stampaErrore(res, 'Errore');
      });
  }
}
