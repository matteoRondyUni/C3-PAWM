import { CanLoad, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthNegozioGuard implements CanLoad {
  constructor(private authService: AuthenticationService, private router: Router) { }

  canLoad(): Observable<boolean> {
    return this.authService.tipologiaToken.pipe(
      filter(val => val !== null),
      take(1),
      map(tipologiaToken => {
        console.log("tipologiatoken", tipologiaToken);
        if (tipologiaToken == 'NEGOZIO')
          return true;
        else {
          this.router.navigateByUrl('/login');
          return false;
        }
      }))
  }

}