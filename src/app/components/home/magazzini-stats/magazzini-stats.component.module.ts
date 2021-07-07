import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { MagazziniStatsComponent } from './magazzini-stats.component';

@NgModule({
    declarations: [MagazziniStatsComponent],
    exports: [RouterModule, MagazziniStatsComponent],
    imports: [CommonModule, IonicModule]
})
export class MagazziniStatsModule { }