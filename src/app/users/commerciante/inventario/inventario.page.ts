import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../../../services/authentication.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {
  inventario = [];
  token: JSON;

  constructor(private http: HttpClient, private authService: AuthenticationService, private alertController: AlertController) {
    this.loadInventario();
  }

  ngOnInit() {
  }

  async loadInventario() {
    const token_value = (await this.authService.getToken()).value;
    const headers = { 'token': token_value };

    console.log("header: ", headers);

    this.http.get('/inventario', { headers }).subscribe(
      res => {
        this.inventario = res['results'].sort((a, b) => {
          if (a.nome < b.nome) {
            return -1;
          }
          if (a.nome > b.nome) {
            return 1;
          }
          return 0;
        });
        console.log(this.inventario);
      },
      async res => {
        const alert = await this.alertController.create({
          header: 'Errore nella sessione',
          message: "Rieffettua il login",
          buttons: ['OK'],
        });
        await alert.present();
      });
  }
}
