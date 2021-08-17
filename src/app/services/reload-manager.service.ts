import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReloadManagerService {

  constructor() { }

  /**
   * Termina il Reload.
   * @param event 
   */
  completaReload(event) {
    if (event != null)
      event.target.complete();
  }

  /**
   * Controlla che il Reload delle Merci negli Ordini è stato terminato.
   * @param ordini Ordini da controllare
   * @returns true se il Reload è stato terminato, false altrimenti
   */
  controlMerciOrdine(ordini) {
    if (ordini.lenght == 0) return true;
    for (let i = 0; i < ordini.length; i++) {
      if (ordini[i].merci == null || ordini[i].merci == undefined || ordini[i].merci.length == 0)
        return false;
    }
    return true;
  }
}
