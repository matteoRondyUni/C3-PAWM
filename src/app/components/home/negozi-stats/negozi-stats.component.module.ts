import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NegoziStatsComponent } from './negozi-stats.component';

@NgModule({
    declarations: [NegoziStatsComponent],
    exports: [RouterModule, NegoziStatsComponent],
    imports: [CommonModule, IonicModule]
})
export class NegoziStatsModule { }