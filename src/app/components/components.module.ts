import { NgModule } from '@angular/core';
import { AlertFeatureNotImplementedComponent } from './alert-feature-not-implemented/alert-feature-not-implemented.component';
import { PageFooterComponent } from './page-footer/page-footer.component';
import { CookieAlertComponent } from './cookie-alert/cookie-alert.component';

@NgModule({
    declarations: [AlertFeatureNotImplementedComponent, PageFooterComponent, CookieAlertComponent],
    exports: [AlertFeatureNotImplementedComponent, PageFooterComponent, CookieAlertComponent]
})
export class ComponentsModule { }