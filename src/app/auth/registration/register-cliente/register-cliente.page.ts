import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from '../../../services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-register-cliente',
  templateUrl: './register-cliente.page.html',
  styleUrls: ['./register-cliente.page.scss'],
})
export class RegisterClientePage implements OnInit {
  credenziali: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.credenziali = this.fb.group({
      nome: ['carlo', [Validators.required]],
      cognome: ['carlo', [Validators.required]],
      email: ['carlo@gmail.com', [Validators.required, Validators.email]],
      password: ['carlocarlo', [Validators.required, Validators.minLength(8)]],
      telefono: ['1234567890', [Validators.required]],
      indirizzo: ['carlo', [Validators.required]],
    });
  }

  isRegistrationPage() {
    document.getElementById("header-registration").style.color = "white";
    document.getElementById("header-registration").style.backgroundColor = "#2196F3";
    document.getElementById("header-registration-label").style.color = "white";
    document.getElementById("header-registration-label").style.backgroundColor = "#2196F3";
  }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.registerCliente(this.credenziali.value).subscribe(
      async (res) => {
        await loading.dismiss();
        this.router.navigateByUrl('/login');
        const alert = await this.alertController.create({
          header: 'Registrazione completata',
          message: "Ora puoi effettuare il login",
          buttons: ['OK'],
        });
        await alert.present();
      },
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Registrazione fallita',
          message: res.error,
          buttons: ['OK'],
        });

        await alert.present();
      }
    );
  }
}
