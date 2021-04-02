import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AlertFeatureNotImplementedComponent } from './alert-feature-not-implemented/alert-feature-not-implemented.component';
import { PageFooterComponent } from './page-footer/page-footer.component';
import { CookieAlertComponent } from './cookie-alert/cookie-alert.component';
import { HeaderNavigationBarComponent } from './header-navigation-bar/header-navigation-bar.component';

@NgModule({
    declarations: [AlertFeatureNotImplementedComponent, PageFooterComponent, CookieAlertComponent, HeaderNavigationBarComponent],
    exports: [RouterModule, AlertFeatureNotImplementedComponent, PageFooterComponent, CookieAlertComponent, HeaderNavigationBarComponent]
})
export class ComponentsModule { }