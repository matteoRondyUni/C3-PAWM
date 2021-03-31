import { NgModule } from '@angular/core';
import { AlertFeatureNotImplementedComponent } from './alert-feature-not-implemented/alert-feature-not-implemented.component';
import { PageFooterComponent } from './page-footer/page-footer.component';

@NgModule({
    declarations: [AlertFeatureNotImplementedComponent, PageFooterComponent],
    exports: [AlertFeatureNotImplementedComponent, PageFooterComponent]
})
export class ComponentsModule { }