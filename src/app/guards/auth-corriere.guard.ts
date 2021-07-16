import { CanLoad, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthCorriereGuard implements CanLoad {
  constructor(private authService: AuthenticationService, private router: Router) { }

  canLoad(): Observable<boolean> {
    return this.authService.tipologiaToken.pipe(
      filter(val => val !== null),
      take(1),
      map(tipologiaToken => {
        if (tipologiaToken == 'CORRIERE')
          return true;
        else {
          this.router.navigateByUrl('/login');
          return false;
        }
      }))
  }

}