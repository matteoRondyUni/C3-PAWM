import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from '../../../services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-register-attivita',
  templateUrl: './register-attivita.page.html',
  styleUrls: ['./register-attivita.page.scss'],
})
export class RegisterAttivitaPage implements OnInit {
  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.credentials = this.fb.group({
      ragione_sociale: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      telefono: ['', [Validators.required]],
      indirizzo: ['', [Validators.required]],
    });
  }

  isRegistrationPage() {
    document.getElementById("header-registration").style.color = "white";
    document.getElementById("header-registration").style.backgroundColor = "#2196F3";
    document.getElementById("header-registration-label").style.color = "white";
    document.getElementById("header-registration-label").style.backgroundColor = "#2196F3";
  }

  async register() {
    // if (!this.selectedType) {
    //   return console.log("SELEZIONARE UN TIPO!");
    // }
    // const loading = await this.loadingController.create();
    // await loading.present();
    // if (this.authService.register(this.credentials.value)) {
    //   await loading.dismiss();
    //   this.router.navigateByUrl('/login', { replaceUrl: true });
    // } else {
    //   await loading.dismiss();
    // }

    console.log(this.credentials.value);
  }
}
