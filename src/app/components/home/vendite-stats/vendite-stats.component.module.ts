import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { VenditeStatsComponent } from './vendite-stats.component';

@NgModule({
    declarations: [VenditeStatsComponent],
    exports: [RouterModule, VenditeStatsComponent],
    imports: [CommonModule, IonicModule]
})
export class VenditeStatsModule { }