import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { ErrorManagerService } from 'src/app/services/error-manager/error-manager.service';
import { MagazziniPage } from '../../utenti/modal/magazzini/magazzini.page';
import { DitteTrasportiPage } from '../../utenti/modal/ditte-trasporti/ditte-trasporti.page';
import { NegoziPage } from '../../utenti/modal/negozi/negozi.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  cliente = { 'nome': '' };

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private http: HttpClient,
    private errorManager: ErrorManagerService,
    private modalController: ModalController
  ) {
    this.loadCliente();
  }

  ngOnInit() {
  }

  apriOrdini() {
    this.router.navigateByUrl('/cliente/ordini', { replaceUrl: true });
  }

  apriImpostazioni() {
    this.router.navigateByUrl('/cliente/impostazioni', { replaceUrl: true });
  }

  async apriNegozi() {
    const modal = await this.modalController.create({
      component: NegoziPage,
      cssClass: 'fullheight'
    });
    return await modal.present();
  }

  async apriMagazzini() {
    const modal = await this.modalController.create({
      component: MagazziniPage,
      cssClass: 'fullheight'
    });
    return await modal.present();
  }

  async apriDitte() {
    const modal = await this.modalController.create({
      component: DitteTrasportiPage,
      cssClass: 'fullheight'
    });
    return await modal.present();
  }

  async loadCliente() {
    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };

    this.http.get('/info/utente', { headers }).subscribe(
      async (res) => {
        var tmp = res['results'];
        this.cliente = tmp[0];
      },
      async (res) => {
        this.errorManager.stampaErrore(res, 'Errore');
      });
  }
}
