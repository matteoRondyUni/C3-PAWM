import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ErrorManagerService } from 'src/app/services/error-manager.service';
import jwt_decode from 'jwt-decode';
import { ModalController } from '@ionic/angular';
import { DitteTrasportiPage } from '../../utenti/modal/ditte-trasporti/ditte-trasporti.page';
import { NegoziPage } from '../../utenti/modal/negozi/negozi.page';
import { MagazziniPage } from '../../utenti/modal/magazzini/magazzini.page';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  magazzino = { "ragione_sociale": "" };

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private http: HttpClient,
    private errorManager: ErrorManagerService,
    private modalController: ModalController
  ) {
    this.loadMagazzino();
  }

  ngOnInit() {
  }

  apriDipendenti() {
    this.router.navigateByUrl('/magazzino/dipendenti', { replaceUrl: true });
  }

  apriImpostazioni() {
    this.router.navigateByUrl('/magazzino/impostazioni', { replaceUrl: true });
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

  async loadMagazzino() {
    const token_value = (await this.authService.getToken()).value;
    const decoded_token: any = jwt_decode(token_value);

    this.http.get('/magazzini/' + decoded_token.id).subscribe(
      async (res) => {
        var tmp = res['results'];
        this.magazzino = tmp[0];
      },
      async (res) => {
        this.errorManager.stampaErrore(res, 'Errore');
      });
  }

}
