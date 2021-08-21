import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';

import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

const TOKEN_KEY = 'jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  tipologiaToken: BehaviorSubject<String> = new BehaviorSubject<String>(null);

  constructor(private http: HttpClient) {
    this.loadToken();
  }

  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });
    if (token && token.value) {
      const decoded_token: any = jwt_decode(token.value);
      this.tipologiaToken.next(decoded_token.tipo);
    } else {
      this.tipologiaToken.next("");
    }
  }

  async getToken() {
    const toReturn = await Storage.get({ key: TOKEN_KEY });
    if (toReturn.value == null) toReturn.value = '';
    return toReturn;
  }

  loginUser(credentials: { email, password }): Observable<any> {
    return this.http.post('/login/utente', credentials).pipe(
      map((data: any) => data.accessToken),
      switchMap(token => {
        const decoded_token: any = jwt_decode(token);
        Storage.set({ key: TOKEN_KEY, value: token });
        switch (decoded_token.tipo) {
          case "CLIENTE": return "1";
          case "COMMERCIANTE": return "2";
          case "CORRIERE": return "3";
          case "MAGAZZINIERE": return "4";
          default: return "0";
        }
      }),
      tap(_ => {
        this.loadToken();
      })
    )
  }

  loginAttivita(credentials: { email, password }): Observable<any> {
    return this.http.post('/login/attivita', credentials).pipe(
      map((data: any) => data.accessToken),
      switchMap(token => {
        const tipoAttivita: any = jwt_decode(token);
        Storage.set({ key: TOKEN_KEY, value: token });
        switch (tipoAttivita.tipo) {
          case "NEGOZIO": return "1";
          case "MAGAZZINO": return "2";
          case "DITTA_TRASPORTI": return "3";
          default: return "0";
        }
      }),
      tap(_ => {
        this.loadToken();
      })
    )
  }

  logout(): Promise<void> {
    this.tipologiaToken.next("");
    return Storage.remove({ key: TOKEN_KEY });
  }

  registerCliente(credentials): Observable<any> {
    return this.http.post('/register/cliente', credentials);
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

    return this.http.post('/register/dipendente', to_send);
  }

  registerAttivita(credentials): Observable<any> {
    return this.http.post('/register/attivita', credentials);
  }
}