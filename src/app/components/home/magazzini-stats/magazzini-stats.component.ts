import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ErrorManagerService } from 'src/app/services/error-manager.service';

@Component({
  selector: 'app-magazzini-stats',
  templateUrl: './magazzini-stats.component.html',
  styleUrls: ['./magazzini-stats.component.scss'],
})
export class MagazziniStatsComponent implements OnInit {
  n_magazzini: any;
  nome;
  sottotitolo;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private errorManager: ErrorManagerService,
  ) {
    this.getNumeroMagazzini()
  }

  ngOnInit() { }

  async getNumeroMagazzini() {
    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };

    this.http.get('/magazzini/count', { headers }).subscribe(
      async (res) => {
        this.n_magazzini = res['count'];
        if (this.n_magazzini == 1) {
          this.nome = 'magazzino';
          this.sottotitolo = 'convenzionato con C3-PAWM';
        }
        else {
          this.nome = 'magazzini';
          this.sottotitolo = 'convenzionati con C3-PAWM';
        }
      },
      async (res) => {
        this.errorManager.stampaErrore(res, 'Errore');
      });
  }
}
