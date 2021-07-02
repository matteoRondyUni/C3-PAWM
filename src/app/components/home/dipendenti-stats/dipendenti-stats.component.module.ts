import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { DipendentiStatsComponent } from './dipendenti-stats.component';

@NgModule({
    declarations: [DipendentiStatsComponent],
    exports: [RouterModule, DipendentiStatsComponent],
    imports: [CommonModule, IonicModule]
})
export class DipendentiStatsModule { }