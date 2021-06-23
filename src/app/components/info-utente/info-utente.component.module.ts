import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { InfoUtenteComponent } from './info-utente.component';

@NgModule({
    declarations: [InfoUtenteComponent],
    exports: [RouterModule, InfoUtenteComponent],
    imports: [CommonModule, IonicModule]
})
export class InfoUtenteModule { }