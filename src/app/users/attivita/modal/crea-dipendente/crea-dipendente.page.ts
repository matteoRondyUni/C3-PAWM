import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../../services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-crea-dipendente',
  templateUrl: './crea-dipendente.page.html',
  styleUrls: ['./crea-dipendente.page.scss'],
})
export class CreaDipendentePage implements OnInit {
  credenziali: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.credenziali = this.fb.group({
      nome: ['', [Validators.required]],
      cognome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)],],
      telefono: ['', [Validators.required]],
      indirizzo: ['', [Validators.required]],
    });
  }

  async closeModal() {
    this.modalController.dismiss();
  }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();

    (await this.authService.registerDipendente(this.credenziali.value)).subscribe(
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Nuovo dipendente creato',
          message: "Ora è stato aggiunto alla lista",
          buttons: ['OK'],
        });
        this.modalController.dismiss(true);
        await alert.present();
      },
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Creazione dipendente fallita',
          message: res.error,
          buttons: ['OK'],
        });
        this.modalController.dismiss(false);
        await alert.present();
      });
  }
}
