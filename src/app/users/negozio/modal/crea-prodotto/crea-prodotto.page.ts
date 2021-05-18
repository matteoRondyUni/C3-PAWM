import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-crea-prodotto',
  templateUrl: './crea-prodotto.page.html',
  styleUrls: ['./crea-prodotto.page.scss'],
})
export class CreaProdottoPage implements OnInit {
  dati: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.dati = this.fb.group({
      nome: ['', [Validators.required]],
      quantita: ['', [Validators.required]],
      prezzo: ['', [Validators.required]]
    });
  }

  async closeModal() {
    this.modalController.dismiss();
  }

  async creaProdotto() {
    this.modalController.dismiss();
    console.log("dati: ", this.dati.value);
    //TODO
  }
}
