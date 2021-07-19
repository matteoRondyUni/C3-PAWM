import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ErrorManagerService } from 'src/app/services/error-manager.service';

@Component({
  selector: 'app-inventario-stats',
  templateUrl: './inventario-stats.component.html',
  styleUrls: ['../home-components.scss'],
})
export class InventarioStatsComponent implements OnInit {
  n_prodotti: any;
  nome;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private errorManager: ErrorManagerService,
  ) {
    this.getNumeroProdotti()
  }

  ngOnInit() { }

  async getNumeroProdotti() {
    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };

    this.http.get('/inventario/count', { headers }).subscribe(
      async (res) => {
        this.n_prodotti = res['count'];
        if (this.n_prodotti == 1) this.nome = 'prodotto';
        else this.nome = 'prodotti';
      },
      async (res) => {
        this.errorManager.stampaErrore(res, 'Errore');
      });
  }

}
