import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageFooterComponent } from './page-footer/page-footer.component';
import { CookieAlertComponent } from './cookie-alert/cookie-alert.component';
import { HeaderNavigationBarComponent } from './header-navigation-bar/header-navigation-bar.component';

@NgModule({
    declarations: [PageFooterComponent, CookieAlertComponent, HeaderNavigationBarComponent],
    exports: [RouterModule, PageFooterComponent, CookieAlertComponent, HeaderNavigationBarComponent]
})
export class ComponentsModule { }