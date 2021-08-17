import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AlertManagerService } from 'src/app/services/alert-manager/alert-manager.service';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { ErrorManagerService } from 'src/app/services/error-manager/error-manager.service';

@Component({
  selector: 'app-impostazioni',
  templateUrl: './impostazioni.page.html',
  styleUrls: ['./impostazioni.page.scss'],
})
export class ImpostazioniPage implements OnInit {
  public segment: string = "profilo";
  dati: FormGroup;
  passwords: FormGroup;
  attivita = { 'id': null, 'ragione_sociale': null, 'email': null, 'telefono': null, 'indirizzo': null };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthenticationService,
    private alertManager: AlertManagerService,
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
      ragione_sociale: [this.attivita.ragione_sociale, [Validators.required]],
      email: [this.attivita.email, [Validators.required, Validators.email]],
      telefono: [this.attivita.telefono, [Validators.required]],
      indirizzo: [this.attivita.indirizzo, [Validators.required]],
    });
  }

  async getDatiProfilo() {
    const loading = await this.loadingController.create();
    await loading.present();
    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };

    this.http.get('/info/attivita', { headers }).subscribe(
      async (res) => {
        const tmp = await res['results'];
        this.attivita = tmp[0];
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

    this.http.put('/attivita/' + this.attivita.id, to_send).subscribe(
      async (res) => {
        this.getDatiProfilo()
        await loading.dismiss();
        this.alertManager.createInfoAlert('Profilo aggiornato', 'I tuoi dati sono stati aggiornati');
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

    this.http.put('/modifica/password/' + this.attivita.id, to_send).subscribe(
      async (res) => {
        await loading.dismiss();
        this.alertManager.createInfoAlert('Password aggiornata', 'La password del tuo account è stata aggiornata');
      },
      async (res) => {
        await loading.dismiss();
        this.errorManager.stampaErrore(res, 'Modifica Fallita');
      });
  }
}
