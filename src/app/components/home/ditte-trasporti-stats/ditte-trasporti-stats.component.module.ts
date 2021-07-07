import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { DitteTrasportiStatsComponent } from './ditte-trasporti-stats.component';

@NgModule({
    declarations: [DitteTrasportiStatsComponent],
    exports: [RouterModule, DitteTrasportiStatsComponent],
    imports: [CommonModule, IonicModule]
})
export class DitteTrasportiStatsModule { }