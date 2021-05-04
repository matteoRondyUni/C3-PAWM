import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

const TOKEN_KEY = 'my-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';

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
  }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return Storage.remove({ key: TOKEN_KEY });
  }
}