import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { InventarioStatsComponent } from './inventario-stats.component';

@NgModule({
    declarations: [InventarioStatsComponent],
    exports: [RouterModule, InventarioStatsComponent],
    imports: [CommonModule, IonicModule]
})
export class InventarioStatsModule { }