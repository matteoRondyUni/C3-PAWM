import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';

import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

const TOKEN_KEY = 'my-token';


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

  async getToken() {
    const toReturn = await Storage.get({ key: TOKEN_KEY });
    return toReturn;
  }

  loginUser(credentials: { email, password }): Observable<any> {
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

  loginAttivita(credentials: { email, password }): Observable<any> {
    return this.http.post('/attivita/login', credentials).pipe(
      map((data: any) => data.accessToken),
      switchMap(token => {
        console.log("token login", token);
        const tipoAttivita: any = jwt_decode(token);
        console.log("tmp: ", tipoAttivita.tipo);
        Storage.set({ key: TOKEN_KEY, value: token });
        switch (tipoAttivita.tipo) {
          //TODO da finire
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

  registerCliente(credentials): Observable<any> {
    return this.http.post('/register/cliente', credentials).pipe(
      map((data: any) => data.esito),
      switchMap(esito => {
        return esito;
      }
      ))
  }

  async registerDipendente(credenziali): Promise<Observable<any>> {
    const token = await this.getToken();
    const to_send = {
      'nome': credenziali.nome,
      'cognome': credenziali.cognome,
      'email': credenziali.email,
      'password': credenziali.password,
      'telefono': credenziali.telefono,
      'indirizzo': credenziali.indirizzo,
      'token_value': token.value
    }

    console.log("to_send: ", to_send);

    return this.http.post('/register/dipendente', to_send).pipe(
      map((data: any) => data.esito),
      switchMap(esito => { return esito; }))
  }

  registerAttivita(credentials): Observable<any> {
    return this.http.post('/register/attivita', credentials).pipe(
      map((data: any) => data.esito),
      switchMap(esito => { return esito; }))
  }
}