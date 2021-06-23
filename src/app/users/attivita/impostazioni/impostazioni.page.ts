import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { map, switchMap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ErrorManagerService } from 'src/app/services/error-manager.service';

@Component({
  selector: 'app-impostazioni',
  templateUrl: './impostazioni.page.html',
  styleUrls: ['./impostazioni.page.scss'],
})
export class ImpostazioniPage implements OnInit {
  public segment: string = "profilo";
  dati: FormGroup;
  passwords: FormGroup;
  user = { 'id': null, 'ragione_sociale': null, 'email': null, 'telefono': null, 'indirizzo': null };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private errorManager: ErrorManagerService,
    private loadingController: LoadingController
  ) {
    this.getDatiProfilo();
  }

  ngOnInit() {
    this.riempiForm();
    this.passwords = this.fb.group({
      old_password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)],],
      new_password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)],],
    });
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }

  riempiForm() {
    this.dati = this.fb.group({
      ragione_sociale: [this.user.ragione_sociale, [Validators.required]],
      email: [this.user.email, [Validators.required, Validators.email]],
      telefono: [this.user.telefono, [Validators.required]],
      indirizzo: [this.user.indirizzo, [Validators.required]],
    });
  }

  async getDatiProfilo() {
    const loading = await this.loadingController.create();
    await loading.present();
    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };

    this.http.get('/info/attivita', { headers }).subscribe(
      async (res) => {
        this.user = await res[0];
        this.riempiForm();
        await loading.dismiss();
      },
      async (res) => {
        this.errorManager.stampaErrore(res, 'Errore');
        await loading.dismiss();
      });
  }

  async aggiornaProfilo() {
    const loading = await this.loadingController.create();
    await loading.present();

    const token_value = (await this.authService.getToken()).value;
    const to_send = {
      'ragione_sociale': this.dati.value.ragione_sociale,
      'email': this.dati.value.email,
      'telefono': this.dati.value.telefono,
      'indirizzo': this.dati.value.indirizzo,
      'token_value': token_value
    }

    this.http.put('/attivita/' + this.user.id, to_send).pipe(
      map((data: any) => data.esito),
      switchMap(esito => { return esito; })).subscribe(
        async (res) => {
          const text = 'I tuoi dati sono stati aggiornati';
          this.getDatiProfilo()
          await loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Profilo aggiornato',
            message: text,
            buttons: ['OK'],
          });
          await alert.present();
        },
        async (res) => {
          await loading.dismiss();
          this.errorManager.stampaErrore(res, 'Modifica Fallita');
        });

  }

  async aggiornaPassword() {
    const loading = await this.loadingController.create();
    await loading.present();

    const token_value = (await this.authService.getToken()).value;
    const to_send = {
      'old_password': this.passwords.value.old_password,
      'new_password': this.passwords.value.new_password,
      'token_value': token_value
    }

    this.http.put('/modifica/password/' + this.user.id, to_send).pipe(
      map((data: any) => data.esito),
      switchMap(esito => { return esito; })).subscribe(
        async (res) => {
          const text = 'La password del tuo account è stata aggiornata';
          await loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Password aggiornata',
            message: text,
            buttons: ['OK'],
          });
          await alert.present();
        },
        async (res) => {
          await loading.dismiss();
          this.errorManager.stampaErrore(res, 'Modifica Fallita');
        });
  }
}
