import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  apriOrdini(){
    this.router.navigateByUrl('/negozio/ordini', { replaceUrl: true });
  }

  apriInventario(){
    this.router.navigateByUrl('/negozio/inventario', { replaceUrl: true });
  }

  apriDipendenti(){
    this.router.navigateByUrl('/negozio/dipendenti', { replaceUrl: true });
  }
}
