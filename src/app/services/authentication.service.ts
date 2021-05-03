import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { LoadingController } from '@ionic/angular';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

const TOKEN_KEY = 'my-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';

  constructor(private http: HttpClient, private loadingController: LoadingController) {
    this.loadToken();
  }

  async validateToken(token): Promise<boolean> {
    const request = new XMLHttpRequest();
    var toReturn: boolean;
    request.open('POST', '/control/JWT', true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify(token));
    request.onload = function () {
      if (this.status >= 200 && this.status < 400) {
        console.log("RIUSCITO");
        toReturn = true;
        console.log("tmp valore aggiornato: ", toReturn);
      } else {
        // We reached our target server, but it returned an error
        toReturn = false;
        console.log("ERRORE POST VALIDATE JWT");
      }
    }
    return toReturn;
  }

  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });
    var tmp: boolean;
    if (token && token.value) {
      tmp = await this.validateToken(token);
      console.log("tmp: ", tmp);
      this.isAuthenticated.next(tmp);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  login(credentials: { email, password }) {

    const request = new XMLHttpRequest();
    request.open('POST', '/users/login', true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify(credentials));
    request.onload = function () {
      if (this.status >= 200 && this.status < 400) {
        const data = JSON.parse(this.response);
        Storage.set({ key: TOKEN_KEY, value: data.accessToken })
        console.log("dati: ", data);
        const dastampre = Storage.get({ key: TOKEN_KEY });
        console.log("storage: ", dastampre);
      } else {
        // We reached our target server, but it returned an error
      }
    }
    return false;

    // console.log("risposta: ", this.http.post<any>('/users/login', credentials));
    // this.http.post<any>('/users/login', credentials).pipe(
    //   map((data: any) => console.log("data: ", data),

    //   ));
    // return false;

    // if (credentials.email == "prova@prova.it" && credentials.password == "prova99Test") {
    //  console.log("loggato");
    //    Storage.set({ key: TOKEN_KEY, value: "LOGGATO" })
    //   return true;
    //  }
    // else {
    //    console.log("dati errati");
    //   Storage.remove({ key: TOKEN_KEY });
    //   return false;
    //  }
  }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return Storage.remove({ key: TOKEN_KEY });
  }
}