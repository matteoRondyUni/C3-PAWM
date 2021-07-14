import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from '../../../services/authentication.service';
import { ErrorManagerService } from '../../../services/error-manager.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-register-attivita',
  templateUrl: './register-attivita.page.html',
  styleUrls: ['./register-attivita.page.scss'],
})
export class RegisterAttivitaPage implements OnInit {
  credenziali: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private errorManager: ErrorManagerService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.credenziali = this.fb.group({
      ragione_sociale: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      telefono: ['', [Validators.required]],
      indirizzo: ['', [Validators.required]],
    });
  }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();


    this.authService.registerAttivita(this.credenziali.value).subscribe(
      async (res) => {
        await loading.dismiss();
        this.router.navigateByUrl('/login', { replaceUrl: true });
        const alert = await this.alertController.create({
          header: 'Registrazione completata',
          message: "Ora puoi effettuare il login",
          buttons: ['OK'],
        });
        await alert.present();
      },
      async (res) => {
        await loading.dismiss();
        this.errorManager.stampaErrore(res, 'Registrazione fallita');
      }
    );
  }
}
