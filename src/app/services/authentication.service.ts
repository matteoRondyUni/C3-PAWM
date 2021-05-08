import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject, throwError } from 'rxjs';
import jwt_decode from 'jwt-decode';

import { Plugins } from '@capacitor/core';
import { ConstantPool } from '@angular/compiler';
import * as crypto from "crypto-js";

const { Storage } = Plugins;

const TOKEN_KEY = 'my-token';

// var crypto = require("crypto-js");

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';
  type: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private http: HttpClient) {
    this.loadToken();
  }

  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });
    if (token && token.value) {
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  async getType() {
    return (await Storage.get({ key: "TipoUtente" })).value;
  }

  login(credentials: { email, password }): Observable<any> {
    // const request = new XMLHttpRequest();
    // request.open('POST', '/users/login', true);
    // request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    // request.send(JSON.stringify(credentials));
    // request.onload = function () {
    //   if (this.status >= 200 && this.status < 400) {
    //     const data = JSON.parse(this.response);
    //     Storage.set({ key: TOKEN_KEY, value: data.accessToken });
    //     console.log("dati: ", data);
    //     const dastampre = Storage.get({ key: TOKEN_KEY });
    //     console.log("storage: ", dastampre);
    //     Storage.set({ key: "TipoUtente", value: data.tipoUtente });
    //     return true;
    //   } else {
    //     return false;
    //     // We reached our target server, but it returned an error
    //   }
    // }

    return this.http.post('/users/login', credentials).pipe(
      map((data: any) => data.accessToken),
      switchMap(token => {
        console.log("token login", token);
        const tipoUtente: any = jwt_decode(token);
        console.log("tmp: ", tipoUtente.tipo);
        Storage.set({ key: TOKEN_KEY, value: token });
        switch (tipoUtente.tipo) {
          case "CLIENTE": return "1";
          case "COMMERCIANTE": return "2";
          case "CORRIERE": return "3";
          case "MAGAZZINIERE": return "4";
          default: return "0";
        }
      }),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    )

  }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return Storage.remove({ key: TOKEN_KEY });
  }

  register(credentials: { nome, cognome, email, password, indirizzo }): Observable<any> {
    return this.http.post('/register/cliente', credentials).pipe(
      map((data: any) => data.esito),
      switchMap(esito => {
        return esito;
      }
      ))
  }

}