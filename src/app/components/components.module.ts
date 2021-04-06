import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { PageFooterComponent } from './page-footer/page-footer.component';
import { CookieAlertComponent } from './cookie-alert/cookie-alert.component';
import { HeaderNavigationBarComponent } from './header-navigation-bar/header-navigation-bar.component';

@NgModule({
    declarations: [PageFooterComponent, CookieAlertComponent, HeaderNavigationBarComponent],
    exports: [RouterModule, PageFooterComponent, CookieAlertComponent, HeaderNavigationBarComponent],
    imports: [CommonModule, IonicModule]
})
export class ComponentsModule { }