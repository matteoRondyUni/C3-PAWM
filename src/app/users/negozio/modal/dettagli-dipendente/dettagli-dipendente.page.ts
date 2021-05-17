import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavParams } from '@ionic/angular';
import { Router } from "@angular/router";
import { AuthenticationService } from 'src/app/services/authentication.service';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dettagli-dipendente',
  templateUrl: './dettagli-dipendente.page.html',
  styleUrls: ['./dettagli-dipendente.page.scss'],
})
export class DettagliDipendentePage implements OnInit {
  @Input() id_dipendente: string;
  @Input() nome: string;
  @Input() cognome: string;
  @Input() email: string;
  @Input() telefono: string;
  @Input() indirizzo: string;


  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthenticationService,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    this.id_dipendente = this.navParams.get('id_dipendente');
    this.nome = this.navParams.get('nome');
    this.cognome = this.navParams.get('cognome');
    this.email = this.navParams.get('email');
    this.telefono = this.navParams.get('telefono');
    this.indirizzo = this.navParams.get('indirizzo');
  }

  async closeModal() {
    this.modalController.dismiss();
  }

  async eliminaDipendente() {
    const loading = await this.loadingController.create();
    await loading.present();

    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };

    this.http.delete('/dipendenti/' + this.id_dipendente, { headers }).pipe(
      map((data: any) => data.esito),
      switchMap(esito => { return esito; })).subscribe(
        async (res) => {
          const text = 'Il dipendente ' + this.nome + ' ' + this.cognome + ' è stato eliminato';
          await loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Dipendente eliminato',
            message: text,
            buttons: ['OK'],
          });
          this.modalController.dismiss(true);
          await alert.present();
        },
        async (res) => {
          await loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Eliminazione fallita',
            message: res.error,
            buttons: ['OK'],
          });
          this.modalController.dismiss(false);
          await alert.present();
        });
  }
}
