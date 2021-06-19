import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private errorManager: ErrorManagerService,
    private loadingController: LoadingController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.dati = this.fb.group({
      ragione_sociale: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      indirizzo: ['', [Validators.required]],
    });

    this.passwords = this.fb.group({
      old_password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)],],
      new_password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)],],
    });
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }

  async aggiornaProfilo() {

  }

  async aggiornaPassword() {

  }
}
